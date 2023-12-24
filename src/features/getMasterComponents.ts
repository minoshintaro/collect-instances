export function getMasterComponents(nodes: readonly SceneNode[]): ComponentNode[] {
  return nodes.flatMap(node => {
    switch (node.type) {
      case 'INSTANCE':
        return node.mainComponent ? [node.mainComponent] : [];
      case 'COMPONENT_SET':
        return node.children.filter(child => child.type === 'COMPONENT') as ComponentNode[];
      case 'COMPONENT':
        return [node];
      default:
        return [];
    }
  });
}
