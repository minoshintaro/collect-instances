import { Target, InstanceCatalog, InstanceGroup } from "../types";
import { getInnerText } from "./getInnerText";

export function generateInstanceCatalog(props: Target): InstanceCatalog {
  const { nodes, selection } = props;
  const map: InstanceCatalog['map'] = new Map();
  const unknown: InstanceCatalog['unknown'] = new Set();

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
          const innerText = getInnerText(node);

          if (masterComponent) {
            const instanceGroup: InstanceGroup = map.get(masterComponent) || new Map();
            const instanceSet: Set<InstanceNode> = instanceGroup.get(innerText) || new Set();
            instanceSet.add(node);
            instanceGroup.set(innerText, instanceSet);
            map.set(masterComponent, instanceGroup);
          } else {
            unknown.add(node);
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
