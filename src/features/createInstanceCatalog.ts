import { MasterNameMap } from "../types";
import { getMasterComponentSet, getMasterName, getInnerText } from "./get";

export async function createInstanceCatalog(current: PageNode): Promise<MasterNameMap> {
  const catalog: MasterNameMap = new Map();
  const scope: Set<ComponentNode> = getMasterComponentSet([...current.selection]);
  let targetNodes: SceneNode[] = [...current.children];
  let subNodes: SceneNode[] = [];

  while (targetNodes.length > 0) {
    for (const node of targetNodes) {
      switch (node.type) {
        case 'FRAME':
        case 'GROUP':
        case 'SECTION': {
          subNodes.push(...node.children);
          break;
        }
        case 'INSTANCE': {
          const component: ComponentNode | null = node.mainComponent;
          if (component) {
            // スコープの判定
            if (scope.size && !scope.has(component)) break;

            // キー
            const masterName = getMasterName(component);
            const content = getInnerText(node);

            // バリュー
            const componentIdMap = catalog.get(masterName) || new Map();
            const contentMap = componentIdMap.get(component.id) || new Map();
            const instanceIdSet = contentMap.get(content) || new Set();

            // セット
            instanceIdSet.add(node.id);
            contentMap.set(content, instanceIdSet);
            componentIdMap.set(component.id, contentMap);
            catalog.set(masterName, componentIdMap);
          }
          // } else {
          //   const instanceIdSet = catalog.get('Unknown') || new Set();
          // }
          break;
        }
        default: break;
      }
    }
    targetNodes = subNodes;
    subNodes = [];
  }
  return catalog;
}
