import { InstanceCatalog, InstanceCatalogProps, InstanceData } from "../types";
import { getFirstNode } from "./getFirstNode";
import { getInnerText } from "./getInnerText";

export function generateInstanceCatalog(props: InstanceCatalogProps): InstanceCatalog {
  const { targets, scopes } = props;
  const map: InstanceCatalog['map'] = new Map();
  const unknown: InstanceCatalog['unknown'] = [];

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
          if (scopes.length && node.mainComponent && !scopes.includes(node.mainComponent)) break;

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
