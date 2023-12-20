// import { generateMasterName } from "./generateMasterName";
//
// export function collectInstances(nodes: readonly SceneNode[]): Map<string, InstanceNode[]> {
//   const collection = new Map<string, InstanceNode[]>();
//   let subNodes: SceneNode[] = [...nodes];
//
//   while (subNodes.length > 0) {
//     const node = subNodes.pop();
//     if (!node || !node.visible) continue;
//     if (node.type === 'INSTANCE') {
//       const key = generateMasterName(node);
//       const values = collection.get(key) || [];
//       values.push(node);
//       collection.set(key, values);
//     } else if (node.type === 'FRAME' || node.type === 'GROUP' || node.type === 'SECTION') {
//       subNodes.push(...node.children);
//     }
//   }
//
//   return collection;
// }



// export function _collectInstances(nodes: readonly SceneNode[]): InstanceNode[] {
//   let collection: InstanceNode[] = [];
//   let subNodes: SceneNode[] = [...nodes];
//
//   while (subNodes.length > 0) {
//     const node = subNodes.shift();
//     if (!node) continue;
//     if (node.type === 'INSTANCE') collection.push(node);
//     if (node.type === 'SECTION' || node.type === 'FRAME' || node.type === 'GROUP') subNodes.push(...node.children);
//   }
//
//   return collection;
// }
