export function generateMasterName(node: ComponentNode): string {
  return node.parent && node.parent.type === 'COMPONENT_SET'
    ? `${node.parent.name} / ${node.name}`
    : node.name;
}
