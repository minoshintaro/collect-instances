import { isTargetInstance } from "./isTargetInstance";
import { getComponentName } from "./getComponentName";

export function setComponentMap(nodes: InstanceNode[]) {
  const componentMap = new Map<string, InstanceNode[]>();

  for (const node of nodes) {
    // 対象外は除外
    if (!isTargetInstance(node)) continue;

    // Mapオブジェクトにセット
    const key = getComponentName(node);
    const values = componentMap.get(key) || [];
    componentMap.set(key, values.concat([node]));
  }
  return componentMap;
}

  // 並び替え
  // componentMap.forEach(instances => {
  //   instances.sort((a, b) => b.width - a.width);
  // });
