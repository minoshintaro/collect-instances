import { isTargetInstance } from "./isTargetInstance";
import { generateMasterName } from "./generateMasterName";

export function generateCollectionMap(nodes: InstanceNode[]) {
  const componentMap = new Map<string, InstanceNode[]>();

  for (const instance of nodes) {
    // 除外
    if (!isTargetInstance(instance)) continue;

    // Mapオブジェクトにセット
    const key = generateMasterName(instance);
    const values = componentMap.get(key) || [];
    values.push(instance);
    componentMap.set(key, values);
  }
  return componentMap;
}
