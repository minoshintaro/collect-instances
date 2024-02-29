import { KeySet } from "../types";
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
 * # instanceのグループ化
 * - mainComponent.parent?.name
 *   - mainComponent.id
 *     - overriddenProp
 *       - wrapper.id
 *         - instance.id
 *
 * # データ構造
 * - Map<ComponentName, { ComponentIdSet }>
 *   - Map<ComponentId, { VariantName, PropSet }>
 * - Map<Prop, { ExampleId, WrapperIdSet }>
 *   - Map<ExampleId, { Width, Height, Fills }>
 *   - Map<WrapperId, { WrapperName, InstanceSet }>
 */

export interface Catalog {
  index: string[];
  componentNames: Map<string, ComponentNameData>;
  components: Map<string, ComponentIdData>;
  usages: Map<string, PropData>;
  example: Map<string, ExampleData>;
  links: Map<string, LocationData>;
}
export type ComponentNameData = { componentIds: KeySet };
export type ComponentIdData = { name: string, props: KeySet };
export type PropData = { exampleId: string, locationIds: KeySet };
export type ExampleData = { width: number, height: number, fills: MinimalFillsMixin['fills'] };
export type LocationData = { name: string, instances: Set<InstanceData> };
export type InstanceData = { name: string, id: string };

export function generateCatalog(instances: InstanceNode[], targetIds: Set<string>): Catalog {
  const componentNameMap = new Map<string, ComponentNameData>();
  const componentMap = new Map<string, ComponentIdData>();
  const propMap = new Map<string, PropData>();
  const exampleMap = new Map<string, ExampleData>();
  const locationMap = new Map<string, LocationData>();

  for (const instance of instances) {
    /** [1] ノードの確認 */
    if (!instance.visible || !instance.mainComponent) continue;

    const component: ComponentNode = instance.mainComponent;
    if (targetIds.size > 0 && !targetIds.has(component.id)) continue;

    const wrapperData: WrapperData = getWrapperData(instance);
    if (!wrapperData.standalone) continue;

    /** [2] 登録データの値 */
    const componentSet: (ComponentSetNode | ComponentNode)[] = component.parent && component.parent.type === 'COMPONENT_SET' ? [component.parent, component] : [component];
    const componentName: string = componentSet[0].name;
    const variantName: string = componentSet.length > 1 ? componentSet[1].name : '';

    const prop: string = generateLayerNameAndPropsList(instance).join('\n');

    /** [3] 値の登録 */
    const componentNameData = componentNameMap.get(componentName) || { componentIds: new Set<string>() };
    componentNameData.componentIds.add(component.id);
    componentNameMap.set(componentName, componentNameData);

    /** コンポーネントIDとバリアント名は一対 */
    const componentData = componentMap.get(component.id) || { name: variantName, props: new Set<string>() };
    componentData.props.add(prop);
    componentMap.set(component.id, componentData);

    /** 例示用は一度だけ */
    const propData = propMap.get(prop) || { exampleId: instance.id, locationIds: new Set<string> };
    propData.locationIds.add(wrapperData.id);
    propMap.set(prop, propData);

    if (!exampleMap.has(instance.id)) {
      const exampleData: ExampleData = { width: instance.width, height: instance.height, fills: wrapperData.fills };
      exampleMap.set(instance.id, exampleData);
    }

    /** 配置先IDと配置先名は一対 */
    const locationData = locationMap.get(wrapperData.id) || { name: wrapperData.name, instances: new Set<InstanceData> };
    locationData.instances.add({ name: instance.name, id: instance.id });
    locationMap.set(wrapperData.id, locationData);
  }

  return {
    index: [...componentNameMap.keys()].sort(compareName),
    componentNames: componentNameMap,
    components: componentMap,
    usages: propMap,
    example: exampleMap,
    links: locationMap
  };
}
