export function generateComponentIdSet(nodes: SceneNode[]): Set<string> {
  const set = new Set<string>();

  let targets = nodes;
  while (targets.length > 0) {
    let subNodes: SceneNode[] = [];
    targets.forEach(node => {
      switch (node.type) {
        case 'INSTANCE':
          if (node.mainComponent) set.add(node.mainComponent.id);
          break;
        case 'COMPONENT':
          set.add(node.id);
          break;
        case 'COMPONENT_SET':
          node
            .findChildren(child => child.type === 'COMPONENT')
            .forEach(component => set.add(component.id));
          break;
        case 'BOOLEAN_OPERATION':
          break;
        default:
          if ('children' in node) subNodes = [...subNodes, ...node.children];
          break;
      }
    });
    targets = subNodes;
  }

  return set;
}
