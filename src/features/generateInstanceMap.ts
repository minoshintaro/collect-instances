import { getContainerNode } from "./getContainerNode";
import { getInnerText } from "./getInnerText";

interface InstanceData {
  node: InstanceNode;
  text: string;
  location: SceneNode;
}

export function generateInstanceMap(nodes: readonly SceneNode[]): Map<InstanceNode['mainComponent'], InstanceData[]> {
  const instanceMap = new Map<InstanceNode['mainComponent'], InstanceData[]>();
  let targetNodes: SceneNode[] = [...nodes];

  while (targetNodes.length > 0) {
    let subNodes: SceneNode[] = [];

    for (const node of targetNodes) {
      // 除外
      if (!node || !node.visible) continue;

      // Mapに登録
      if (node.type === 'INSTANCE') {
        const key = node.mainComponent;
        const values = instanceMap.get(key) || [];
        const data = {
          node: node,
          text: getInnerText(node),
          location: getContainerNode(node)
        }
        values.push(data);
        instanceMap.set(key, values);
      } else if (node.type === 'FRAME' || node.type === 'GROUP' || node.type === 'SECTION') {
        subNodes.push(...node.children);
      }
    }

    targetNodes = subNodes;
  }

  return instanceMap;
}
