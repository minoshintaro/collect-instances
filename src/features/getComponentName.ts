export function getComponentName(node: InstanceNode): string {
  const component = node.mainComponent;
  if (!component) return 'Anonymous';
  if (component.parent && component.parent.type === 'COMPONENT_SET') return `${component.parent.name}/${component.name}`;
  return component.name;
}
