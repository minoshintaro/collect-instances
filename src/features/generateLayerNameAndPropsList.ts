import { getNodeValue } from "./get";

export function generateLayerNameAndPropsList(input: InstanceNode): string[] {
  // [1] 上書き属性をMapに変換
  const overrideMap = input.overrides.reduce((result: Map<string, NodeChangeProperty[]>, override) => {
    return result.set(override.id, [...override.overriddenFields]);
  }, new Map());

  // [2] インスタンスおよび配下のノード集
  const subNodes = input
    .findAllWithCriteria({ types: ['FRAME', 'GROUP', 'RECTANGLE', 'LINE', 'ELLIPSE', 'POLYGON', 'STAR', 'TEXT', 'VECTOR', 'BOOLEAN_OPERATION'] })
    .sort((a, b) => a.y === b.y ? a.x - b.x : a.y - b.y);
  const nodes = [input, ...subNodes];

  // [3] レイヤー名と「属性: 値」の一覧
  const layerNameAndPropsList = nodes.reduce((results: string[], node) => {
    // 属性の一覧
    const fields = overrideMap.get(node.id);
    if (!fields) return results;

    // 「属性: 値」
    const fieldAndValueList = fields
      .sort()
      .reduce((results: string[], field) => {
        const value = getNodeValue(node, field);
        const fieldAndValue = `${field}: ${value}`;
        return [...results, fieldAndValue];
      }, []);

    // 「レイヤー名 = 属性: 値, ...」
    const layerNameAndProps = `${node.name} = ${fieldAndValueList.join(', ')}`;
    return [...results, layerNameAndProps];
  }, []);

  return layerNameAndPropsList;
}
