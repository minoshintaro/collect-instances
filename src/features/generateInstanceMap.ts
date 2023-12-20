// import { isTargetInstance } from "./isTargetInstance";
// import { generateMasterName } from "./generateMasterName";
// import { getComponentFullName } from "./getComponentFullName";

export function generateInstanceMap(nodes: readonly SceneNode[]): Map<InstanceNode['mainComponent'], InstanceNode[]> {
  const instanceMap = new Map<InstanceNode['mainComponent'], InstanceNode[]>();
  let stockNodes: SceneNode[] = [...nodes];

  while (stockNodes.length > 0) {
    let temp: SceneNode[] = [];

    for (const node of stockNodes) {
      if (!node || !node.visible) continue;
      if (node.type === 'INSTANCE') {
        const key = node.mainComponent;
        const values = instanceMap.get(key) || [];
        values.push(node);
        instanceMap.set(key, values);
      } else if (node.type === 'FRAME' || node.type === 'GROUP' || node.type === 'SECTION') {
        temp.push(...node.children);
      }
    }

    stockNodes = temp;
  }

  return instanceMap;
}


// export function generateCollectionMap(nodes: InstanceNode[]) {
//   const collectionMap = new Map<string, InstanceNode[]>();
//
//   for (const instance of nodes) {
//     // 除外
//     if (!isTargetInstance(instance)) continue;
//
//     // Mapオブジェクトにセット
//     const key = generateMasterName(instance);
//     const values = collectionMap.get(key) || [];
//     values.push(instance);
//     collectionMap.set(key, values);
//   }
//   return collectionMap;
// }
