export function getMasterComponents(nodes: SceneNode[]): ComponentNode[] {
  return nodes.flatMap(node => {
    switch (node.type) {
      case 'INSTANCE':
        return node.mainComponent ? [node.mainComponent] : [];
      case 'COMPONENT_SET':
        return node.findChildren(child => child.type === 'COMPONENT') as ComponentNode[];
      case 'COMPONENT':
        return [node];
      default:
        return [];
    }
  });
}
