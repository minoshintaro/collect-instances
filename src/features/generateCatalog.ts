import { generateLayerNameAndPropsList } from "./generateLayerNameAndPropsList";
import { WrapperData, getWrapperData } from "./getWrapperData";
import { compareName } from "./utilities";

/**
 * # 出力結果
 * <container> // lv0
 *   <section> // lv1
 *     <h2>ComponentName</h2>
 *     <section_row>
 *       <section_col> // lv2
 *         <h3>VariantName</h3>
 *         <stack> // lv3
 *           <figure><img src="instance.clone()"></figure>
 *           <p>prop</p> ...
 *           <p>WrapperName: <a href="instance.id">InstanceName</a>, ... </p>
 *         </stack> ...
 *
 * # 出力手順
 * names.forEach(name =>
 *   componentMap.get(name) => Map<ComponentId, ComponentIdData>
 *   componentIdMap.values() => componentIdData[]
 *   componentIdData[].forEach({ name: VariantName, props: Set<Prop> } =>
 *     props.forEach(prop =>
 *       propMap.get(prop) => { locationIds: Set<WrapperId>, instanceIds: Set<InstanceId>, instance: InstanceData }
 *       locationIds.forEach(id =>
 *         wrapperIdMap.get(id) => { name: WrapperName, itemIds: Set<InstanceId> }
 *         instanceIds.forEach(id =>
 *           itemIds.has(id) => createLink
 *
 * # instanceのグループ化
 * - mainComponent.parent?.name
 *   - mainComponent.id
 *     - overriddenProp
 *       - wrapper.id
 *         - instance.id
 */

export interface Catalog {
  index: string[];
  components: Map<string, ComponentIdMap>;
}
export type ComponentIdMap = Map<string, ComponentIdData>;
export type ComponentIdData = { name: string; props: Map<string, PropData>; };
export type PropData = { instance: InstanceData; locations: Map<string, WrapperIdData>; };
export type InstanceData = { name: string; id: string; width: number; height: number; backgrounds: MinimalFillsMixin['fills'] | undefined; };
export type WrapperIdData = { name: string; instances: Set<Instance>; };
export type Instance = { name: string; id: string; };

export function generateCatalog(instances: InstanceNode[], targetIds: Set<string>): Catalog {
  const componentMap = new Map<string, ComponentIdMap>();

  for (const instance of instances) {
    /** [1] ノードの確認 */
    if (!instance.visible || !instance.mainComponent) continue;

    const component: ComponentNode = instance.mainComponent;
    if (targetIds.size > 0 && !targetIds.has(component.id)) continue;

    const wrapper: WrapperData = getWrapperData(instance);
    if (!wrapper.wrapped) continue;

    /** [2] 登録データ */
    const componentSet: (ComponentSetNode | ComponentNode)[] = component.parent && component.parent.type === 'COMPONENT_SET' ? [component.parent, component] : [component];
    const componentName: string = componentSet[0].name;
    const variantName: string = componentSet.length > 1 ? componentSet[1].name : '';
    const prop: string = generateLayerNameAndPropsList(instance).join('\n');

    /** [3] 値の登録 */
    /** [3-1] components */
    const componentIdMap: ComponentIdMap = componentMap.get(componentName) || new Map<string, ComponentIdData>();
    const componentIdData: ComponentIdData = componentIdMap.get(component.id) || {
      name: variantName,
      props: new Map<string, PropData>()
     };
    const propData: PropData = componentIdData.props.get(prop) || {
      instance: {
        name: instance.name,
        id: instance.id,
        width: instance.width,
        height: instance.height,
        backgrounds: wrapper.fills
      },
      locations: new Map<string, WrapperIdData>(),
    };
    const wrapperIdData: WrapperIdData = propData.locations.get(wrapper.id) || {
      name: wrapper.name,
      instances: new Set<Instance>()
    };

    wrapperIdData.instances.add({
      name: instance.name,
      id: instance.id
    });
    propData.locations.set(wrapper.id, wrapperIdData);
    componentIdData.props.set(prop, propData);
    componentIdMap.set(component.id, componentIdData);
    componentMap.set(componentName, componentIdMap);
  }

  return {
    index: [...componentMap.keys()].sort(compareName),
    components: componentMap
  };
}
