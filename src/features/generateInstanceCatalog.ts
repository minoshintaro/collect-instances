import { TargetNode, InstanceCatalog, InstanceIndex, InstanceDataList } from "../types";
import { getInnerText } from "./get";

interface IndexInput {
  map: InstanceCatalog['index'];
  key: string;
  value: string;
}
function setToIndex(input: IndexInput): void {
  const { map, key, value } = input;
  const values = map.get(key) || new Set();
  values.add(value);
  map.set(key, values);
}

interface DataInput {
  map: InstanceCatalog['data'];
  key: string;
  value: { id: string, content: string };
}
function setToData(input: DataInput): void {
  const { map, key, value } = input;
  const values = map.get(key) || [];
  values.push(value);
  map.set(key, values);
}

export function generateInstanceCatalog(props: TargetNode): InstanceCatalog {
  const { nodes, selection } = props;
  const catalog: InstanceCatalog = {
    index: new Map(),
    data: new Map()
  }

  let targetNodes: SceneNode[] = nodes;
  let subNodes: SceneNode[] = [];
  let count: number = 0;

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
          const component: ComponentNode | null = node.mainComponent;
          if (component) {
            // スコープの判定
            if (selection.length && !selection.includes(component)) break;

            // データの登録
            const masterName = component.parent && component.parent.type === 'COMPONENT_SET' ? component.parent.name : component.name;
            const data = { id: node.id, content: getInnerText(node) };
            setToIndex({ map: catalog.index, key: masterName, value: component.id });
            setToData({ map: catalog.data, key: component.id, value: data });

            count += 1;
          } else {
            const data = { id: node.id, content: '' };
            setToData({ map: catalog.data, key: 'Unknown', value: data });
          }
          break;
        }
        default: break;
      }
    }
    targetNodes = subNodes;
    subNodes = [];
  }
  console.log('', 'Instance:', count);
  return catalog;
}
