import { ComponentCatalog, KeySet, ComponentData, VariantData, InstanceData } from "../types";
import { generateComponentIdSet } from "./generateComponentIdSet";
import { getWrapperNode, getComponentFullName, getBackground } from "./get";
import { generateLayerProps } from "./generateLayerProps";

export function createInstanceCatalog(instances: InstanceNode[], selection: readonly SceneNode[]): ComponentCatalog {
  // [0] 格納先
  const componentNameAndIdSet = new Map<string, KeySet>();
  const componentIdAndData = new Map<string, ComponentData>();
  const instanceIdAndData = new Map<string, InstanceData>();

  const targetIds = generateComponentIdSet(selection);

  for (const instance of instances) {
    // [1] ノードの確認
    if (!instance.visible) continue;

    const wrapper: SceneNode | null = getWrapperNode(instance);
    if (!wrapper) continue;

    const component: ComponentNode | null = instance.mainComponent;
    if (!component || (selection.length && !targetIds.has(component.id))) continue;

    // [2] 登録キー
    const fullName: string[] = getComponentFullName(component);
    const prop: string = generateLayerProps(instance).join('\n');

    // [3] 登録
    // インデックス：名前, ID群
    const componentIdSet = componentNameAndIdSet.get(fullName[0]) || new Set();
    componentIdSet.add(component.id);
    componentNameAndIdSet.set(fullName[0], componentIdSet);

    // コンポーネント：ID, 上書き属性, データ
    const componentData = componentIdAndData.get(component.id) || {
      name: fullName[1],
      variants: new Map<string, VariantData>()
    };
    const variantData = componentData.variants.get(prop) || {
      node: instance,
      id: instance.id,
      width: instance.width,
      height: instance.height,
      wrapper: {
        width: instance.parent && ('width' in instance.parent) ? instance.parent.width : wrapper.width,
        height: wrapper.height,
        fills: getBackground(instance),
      },
      ids: new Set([instance.id])
    };
    variantData.ids.add(instance.id);
    componentData.variants.set(prop, variantData);
    componentIdAndData.set(component.id, componentData);

    // インスタンス
    const instanceData: InstanceData = {
      location: wrapper.name
    };
    instanceIdAndData.set(instance.id, instanceData);
  }
  return {
    index: componentNameAndIdSet,
    component: componentIdAndData,
    instance: instanceIdAndData
  };
}
