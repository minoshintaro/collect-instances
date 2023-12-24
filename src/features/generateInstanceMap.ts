import { InstanceMap, InstanceMapProps } from "../types";
import { getFirstNode } from "./getFirstNode";
import { getInnerText } from "./getInnerText";

export function generateInstanceMap(props: InstanceMapProps): InstanceMap {
  const { nodes, filter } = props;
  const instanceMap: InstanceMap = new Map();
  let targetNodes: SceneNode[] = [...nodes];
  let subNodes: SceneNode[] = [];

  while (targetNodes.length > 0) {
    for (const node of targetNodes) {
      if (!node || !node.visible) continue;

      switch (node.type) {
        case 'FRAME':
        case 'GROUP':
        case 'SECTION': {
          subNodes.push(...node.children);
          break;
        }
        case 'INSTANCE': {
          const key = node.mainComponent;
          const values = instanceMap.get(key) || [];
          if (key && filter.length && !filter.includes(key)) continue;

          values.push( {
            node: node,
            text: getInnerText(node),
            location: getFirstNode(node)
          });
          instanceMap.set(key, values);
          break;
        }
        default: break;
      }
    }
    targetNodes = subNodes;
    subNodes = [];
  }
  return instanceMap;
}
