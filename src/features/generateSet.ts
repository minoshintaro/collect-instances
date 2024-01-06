export function generateComponentSet(selection: readonly SceneNode[]): Set<ComponentNode> {
  const set = new Set<ComponentNode>();
  function addValue(node: ComponentNode): void {
    if (!set.has(node)) set.add(node);
  }
  for (const node of selection) {
    switch (node.type) {
      case 'INSTANCE': {
        if (node.mainComponent) addValue(node.mainComponent);
        break;
      }
      case 'COMPONENT_SET': {
        const children = node.findChildren(child => child.type === 'COMPONENT') as ComponentNode[];
        children.forEach(child => addValue(child));
        break;
      }
      case 'COMPONENT': {
        addValue(node);
        break;
      }
      default: break;
    }
  }
  return set;
}
