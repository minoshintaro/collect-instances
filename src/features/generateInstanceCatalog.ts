import { Target, InstanceCatalog, InstanceData } from "../types";
import { getFirstNode } from "./getFirstNode";
import { getInnerText } from "./getInnerText";

export function generateInstanceCatalog(props: Target): InstanceCatalog {
  const { nodes, selection } = props;
  const map: InstanceCatalog['map'] = new Map();
  const unknown: InstanceCatalog['unknown'] = [];

  let targetNodes: SceneNode[] = nodes;
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
          if (selection.length && node.mainComponent && !selection.includes(node.mainComponent)) break;

          const masterComponent: ComponentNode | null = node.mainComponent;
          const instanceData: InstanceData = {
            node: node,
            text: getInnerText(node),
            location: getFirstNode(node)
          };

          if (masterComponent) {
            const instanceDataList: InstanceData[] = map.get(masterComponent) || [];
            instanceDataList.push(instanceData);
            map.set(masterComponent, instanceDataList);
          } else {
            unknown.push(instanceData);
          }
          break;
        }
        default: break;
      }
    }
    targetNodes = subNodes;
    subNodes = [];
  }
  return { map, unknown };
}
