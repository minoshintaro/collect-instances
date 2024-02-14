import { getPropValue } from "./getPropValue";

export function generateLayerProps(input: InstanceNode): string[] {
  // overrides: { id: string; overriddenFields: NodeChangeProperty[] }[] [readonly]
  const targetMap = input.overrides.reduce((map, item) => {
    return map.set(item.id, [...item.overriddenFields])
  }, new Map<string, NodeChangeProperty[]>());

  const subNodes = input
    .findAllWithCriteria({ types: ['FRAME', 'GROUP', 'INSTANCE', 'TEXT'] })
    .sort((a, b) => a.y === b.y ? a.x - b.x : a.y - b.y);

  let results = [];
  for (const node of [input, ...subNodes]) {
    const fields = targetMap.get(node.id);
    if (fields) {

      const values: string[] = fields
        .sort()
        .reduce((results: string[], field: NodeChangeProperty) => {
          const value = getPropValue(node, field);
          return value ? [...results, value] : results;
        }, [] );
      if (values.length > 0) results.push(`${node.name} \{ ${values.join('; ').trim()} \}`);

      // let props: string[] = [];
      // fields.sort().forEach(field => {
      //   const value = getPropValue(node, field);
      //   // const value = (field in node) ? node[field as keyof typeof node] : null;
      //   if (value) props.push(value);
      // });
      // if (props.length > 0) results.push(`${node.name} \{ ${props.join('; ').trim()} \}`);
    }
  }
  return results;
}
