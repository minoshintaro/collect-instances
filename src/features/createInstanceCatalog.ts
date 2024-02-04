import { ComponentCatalog, KeySet, ComponentData, InstanceData } from "../types";
import { generateComponentIdSet } from "./generateSet";
import { getWrapperNode, getComponentFullName, getBackground } from "./get";
import { generateOverriddenProps } from "./generateOverriddenProps";

export function createInstanceCatalog(instances: InstanceNode[], selection: SceneNode[]): ComponentCatalog {
  // [0] 格納先
  const componentNameAndIdSet = new Map<string, KeySet>();
  const componentIdAndData = new Map<string, ComponentData>();
  const instanceIdAndData = new Map<string, InstanceData>();
  const targetIds = generateComponentIdSet(selection);

  for (const instance of instances) {
    // [1] 事前処理
    if (!instance.visible) continue;

    const wrapper: SceneNode | null = getWrapperNode(instance);
    if (!wrapper) continue;

    const component: ComponentNode | null = instance.mainComponent;
    if (!component || (selection.length && !targetIds.has(component.id))) continue;

    // [2] 登録キー
    const fullName: string[] = getComponentFullName(component);
    const prop: string = generateOverriddenProps(instance).join('\n');

    // [3] 登録
    // インデックス
    const componentIdSet = componentNameAndIdSet.get(fullName[0]) || new Set();
    componentIdSet.add(component.id);
    componentNameAndIdSet.set(fullName[0], componentIdSet);

    // コンポーネント
    const componentData = componentIdAndData.get(component.id) || {
      name: fullName[1],
      variants: new Map<string, KeySet>() // [Prop, Set<InstaneId>]
    };
    const instanceIdSet = componentData.variants.get(prop) || new Set();
    instanceIdSet.add(instance.id);
    componentData.variants.set(prop, instanceIdSet);
    componentIdAndData.set(component.id, componentData);

    // インスタンス
    const instanceData: InstanceData = {
      width: instance.width,
      height: instance.height,
      background: getBackground(instance),
      wrapper: {
        name: wrapper.name,
        width: instance.parent && ('width' in instance.parent) ? instance.parent.width : instance.width,
        height: wrapper.height
      }
    };
    instanceIdAndData.set(instance.id, instanceData);
  }
  return {
    index: componentNameAndIdSet,
    component: componentIdAndData,
    instance: instanceIdAndData
  };
}
