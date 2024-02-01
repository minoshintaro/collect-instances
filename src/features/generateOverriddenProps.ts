import { getPropValue } from "./getPropValue";

// 出力:
// 'LayerName { prop: value; ... }, ... '
// を表すために
// [
//   {
//     layerName: node.name,
//     props: [
//       { key: overriddenField, value: node[overriddenField] },
//       ...
//     ]
//   },
//   ...
// ]
//
// 入力:
// ・対象: instace.findAllWithCriteria()
// ・条件: instace.overrides = [{ id: string; overriddenFields: NodeChangeProperty[] }, ... ] [readonly]

export function generateOverriddenProps(input: InstanceNode) {
  const targetIds = input.overrides.map(override => override.id); // overrides: { id: string; overriddenFields: NodeChangeProperty[] }[] [readonly]
  const subNodes = input
    .findAllWithCriteria({ types: ['FRAME', 'GROUP', 'INSTANCE', 'TEXT'] })
    .filter(node => targetIds.includes(node.id))
    .sort((a, b) => a.y === b.y ? a.x - b.x : a.y - b.y);
  const targetNodes = targetIds.includes(input.id) ? [input, ...subNodes] : subNodes;

  let layerProps = [];
  for (const target of targetNodes) {
    const override = input.overrides.find(override => override.id === target.id);

    let props: string[] = [];
    if (override) {
      [...override.overriddenFields]
        .sort()
        .forEach(field => {
          const value = getPropValue(target, field);
          props.push(`${field}: ${String(value)}`);
        });
    }
    layerProps.push(`${target.name} = ${props.join('; ').trim()}`);
  }

  return layerProps;
}
