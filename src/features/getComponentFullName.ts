// export function getNameFromComponent(node: ComponentNode): string {
//   if (node.parent && node.parent.type === 'COMPONENT_SET') return node.parent.name;
//   return node.name;
// }
//
// export function getMasterName(node: InstanceNode): string {
//   if (node.mainComponent) return getNameFromComponent(node.mainComponent);
//   return 'Anonymous';
// }


export function getComponentFullName(node: ComponentNode): string[] {
  return node.parent && node.parent.type === 'COMPONENT_SET'
    ? [node.parent.name, node.name]
    : [node.name];
}

