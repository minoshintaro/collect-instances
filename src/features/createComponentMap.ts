import { isTargetInstance } from "./isTargetInstance";
import { getComponentName } from "./getComponentName";

export function createComponentMap(nodes: InstanceNode[]) {
  const componentMap = new Map<string, InstanceNode[]>();

  for (const node of nodes) {
    // 除外
    if (!isTargetInstance(node)) continue;

    // Mapオブジェクトにセット
    const key = getComponentName(node);
    const values = componentMap.get(key) || [];
    values.push(node);
    componentMap.set(key, values);
  }
  return componentMap;
}
