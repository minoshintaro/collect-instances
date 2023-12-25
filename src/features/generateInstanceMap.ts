import { InstanceMap, InstanceMapProps } from "../types";
import { getFirstNode } from "./getFirstNode";
import { getInnerText } from "./getInnerText";

export function generateInstanceMap(props: InstanceMapProps): InstanceMap {
  const { targets, scopes } = props;
  const componentSet = new Set<ComponentNode | null>;
  const instanceMap: InstanceMap = new Map();
  let targetNodes: SceneNode[] = [...targets];
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
          if (key && scopes.length && !scopes.includes(key)) continue;

          values.push( {
            node: node,
            text: getInnerText(node),
            location: getFirstNode(node)
          });
          componentSet.add(key);
          instanceMap.set(key, values);
          break;
        }
        default: break;
      }
    }
    targetNodes = subNodes;
    subNodes = [];
  }

  // const sortedEntries = Array.from(instanceMap.entries()).sort((a, b) => {
  //   const keyA = a[0];
  //   const keyB = b[0];
  //   return keyA?.name.localeCompare(keyB);
  // });

  return instanceMap;
}
