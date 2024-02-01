import { ComponentMap, VariantMap, InstanceMap, InstancePropMap, InstanceDataList } from "../types";
import { WHITE } from "../settings";
import { generateComponentIdSet } from "./generateSet";
import { getWrapperNode, getBackground, getMasterName, getInnerText } from "./get";
import { generateOverriddenProps } from "./generateOverriddenProps";
// import { cutText } from "./utilities";

export function createInstanceCatalog(instances: InstanceNode[], selection: SceneNode[]): ComponentMap {
  const componentMap: ComponentMap = new Map();
  const targetIds: Set<BaseNodeMixin['id']> = generateComponentIdSet(selection);

  for (const instance of instances) {
    // [0] 事前処理
    if (!instance.visible) continue;

    const component: ComponentNode | null = instance.mainComponent;
    if (!component || (selection.length && !targetIds.has(component.id))) continue;

    const wrapper: SceneNode | null = getWrapperNode(instance);
    if (!wrapper) continue;

    // [1] キー・バリュー
    // Lv1: ComponentMap<'Master Name', VariantMap>
    // Lv2: VariantMap<'ID', IntanceMap>
    // Lv3: InstanceMap<'Content', InstancePropMap>
    // Lv4: InstancePropMap<'Overridden', InstanceDataList>
    // Lv5: InstanceDataList = { K: V }[]

    // Lv1
    const masterName: BaseNodeMixin['name'] = getMasterName(component);
    const variantMap: VariantMap = componentMap.get(masterName) || new Map();

    // Lv2
    const id: BaseNodeMixin['id'] = component.id;
    const instanceMap: InstanceMap = variantMap.get(id) || new Map();

    // Lv3
    const content: string = getInnerText(instance);
    const instancePropMap: InstancePropMap = instanceMap.get(content) || new Map();

    // Lv4
    const overridden: string = generateOverriddenProps(instance).join('\n');
    const instaceDataList: InstanceDataList = instancePropMap.get(overridden) || [];

    // Lv5
    instaceDataList.push({
      id: instance.id,
      width: instance.width,
      height: instance.height,
      background: getBackground(instance) || [WHITE],
      location: { name: wrapper.name, width: wrapper.width, height: wrapper.height }
    });

    // [2] データのセット
    instancePropMap.set(overridden, instaceDataList)
    instanceMap.set(content, instancePropMap);
    variantMap.set(id, instanceMap);
    componentMap.set(masterName, variantMap);
  }

  return componentMap;
}
