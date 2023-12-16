import { isTargetInstance } from "./isTargetInstance";
import { getComponentName } from "./getComponentName";

export function setMap(nodes: InstanceNode[]) {
  const result = new Map<string, InstanceNode[]>();

  // Mapオブジェクトにセット
  for (const node of nodes) {
    if (!isTargetInstance(node)) continue;

    const key = getComponentName(node);
    const values = result.get(key) || [];

    values.push(node);
    result.set(key, values);
  }

  // 並び替え
  result.forEach(instances => {
    instances.sort((a, b) => b.width - a.width);
  });

  console.log('test',result);
  return result;
}

