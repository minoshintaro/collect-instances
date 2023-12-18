import { isTargetInstance } from "./isTargetInstance";
import { generateMasterName } from "./generateMasterName";

export function generateCollectionMap(nodes: InstanceNode[]) {
  const collectionMap = new Map<string, InstanceNode[]>();

  for (const instance of nodes) {
    // 除外
    if (!isTargetInstance(instance)) continue;

    // Mapオブジェクトにセット
    const key = generateMasterName(instance);
    const values = collectionMap.get(key) || [];
    values.push(instance);
    collectionMap.set(key, values);
  }
  return collectionMap;
}
