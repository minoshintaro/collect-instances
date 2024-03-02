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
  entities: Map<string, PropData>;
  locations: Map<string, WrapperIdData>;
  instances: Map<string, InstanceIdData>;
}
export type ComponentIdMap = Map<string, ComponentIdData>;
export type ComponentIdData = { name: string, props: Set<string> };
export type PropData = { locationIds: Set<string>, instanceIds: Set<string>, instance: InstanceData };
export type InstanceData = { name: string, id: string, width: number, height: number, backgrounds: MinimalFillsMixin['fills'] | undefined };
export type WrapperIdData = { name: string, itemIds: Set<string> };
export type InstanceIdData = { name: string };

export function generateCatalog(instances: InstanceNode[], targetIds: Set<string>): Catalog {
  const componentMap = new Map<string, ComponentIdMap>();
  const propMap = new Map<string, PropData>();
  const wrapperMap = new Map<string, WrapperIdData>;
  const instanceMap = new Map<string, InstanceIdData>;

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
    const componentIdData: ComponentIdData = componentIdMap.get(component.id) || { name: variantName, props: new Set<string>() };
    componentIdData.props.add(prop);
    componentIdMap.set(component.id, componentIdData);
    componentMap.set(componentName, componentIdMap);

    /** [3-2] entities */
    const propData: PropData = propMap.get(prop) || {
      locationIds: new Set<string>(),
      instanceIds: new Set<string>(),
      instance: { name: instance.name, id: instance.id, width: instance.width, height: instance.height, backgrounds: wrapper.fills }
    };
    propData.locationIds.add(wrapper.id);
    propData.instanceIds.add(instance.id);
    propMap.set(prop, propData);

    /** [3-3] locations */
    const wrapperIdData: WrapperIdData = wrapperMap.get(wrapper.id) || { name: wrapper.name, itemIds: new Set<string>() };
    wrapperIdData.itemIds.add(instance.id);
    wrapperMap.set(wrapper.id, wrapperIdData);

    /** [3-4] instances */
    const instanceIdData: InstanceIdData = instanceMap.get(instance.id) || { name: instance.name };
    instanceMap.set(instance.id, instanceIdData);
  }

  return {
    index: [...componentMap.keys()].sort(compareName),
    components: componentMap,
    entities: propMap,
    locations: wrapperMap,
    instances: instanceMap
  };
}
