import { getNodeValue } from "./get";
import { compareNodeByPosition } from "./utilities";

export function generateLayerNameAndPropsList(input: InstanceNode): string[] {
  // [1] 上書き属性 → Map
  const overrideMap = input.overrides.reduce((result: Map<string, NodeChangeProperty[]>, override) => {
    return result.set(override.id, [...override.overriddenFields]);
  }, new Map());

  // [2] インスタンス配下のノード集
  const subNodes = input
    .findAllWithCriteria({ types: ['FRAME', 'GROUP', 'RECTANGLE', 'LINE', 'ELLIPSE', 'POLYGON', 'STAR', 'TEXT', 'VECTOR', 'BOOLEAN_OPERATION'] })
    .sort(compareNodeByPosition);

  // [3] ノード集 → レイヤー名と「属性: 値」の一覧
  const layerNameAndPropsList = [input, ...subNodes].reduce((results: string[], node) => {
    // Map → 上書き属性の一覧
    const fields = overrideMap.get(node.id);
    if (!fields) return results;

    // 上書き属性の一覧 → 「属性: 値」集
    const fieldAndValueList = fields.reduce((results: string[], field) => {
      const value = getNodeValue(node, field);
      return !['name', 'exportSettings'].includes(field) ? [...results, `${field}: ${value}`] : results;
    }, []);

    return fieldAndValueList.length > 0 ? [...results, `${node.name} = ${fieldAndValueList.join(', ')}`] : results;
  }, []);

  return layerNameAndPropsList;
}
