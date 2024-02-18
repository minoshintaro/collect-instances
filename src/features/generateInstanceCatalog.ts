import { ComponentCatalog, KeySet, ComponentData, VariantData, InstanceData } from "../types";
import { generateComponentIdSet } from "./generateComponentIdSet";
import { generateLayerNameAndPropsList } from "./generateLayerNameAndPropsList";
import { getWrapperNode, getComponentFullName, getBackground } from "./get";

export function generateInstanceCatalog(instances: InstanceNode[], selection: readonly SceneNode[]): ComponentCatalog {
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
    const prop: string = generateLayerNameAndPropsList(instance).join('\n');

    // [3] 登録
    // [3-1] インデックス：[名前, ID群]
    const componentIdSet = componentNameAndIdSet.get(fullName[0]) || new Set();
    componentIdSet.add(component.id);
    componentNameAndIdSet.set(fullName[0], componentIdSet);

    // [3-2] コンポーネント：[ID, 展開データ] > { バリアント名, 展開事例 } > { id, データ }
    const componentData = componentIdAndData.get(component.id) || {
      name: fullName[1],
      cases: new Map<string, VariantData>()
    };
    const variantData = componentData.cases.get(prop) || {
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
    componentData.cases.set(prop, variantData);
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