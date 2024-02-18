export function generateComponentIdSet(input: readonly SceneNode[]): Set<string> {
  const idSet = new Set<string>();

  let targets: SceneNode[] = [...input];
  while (targets.length > 0) {
    const subNodes = targets.reduce((results: SceneNode[], node: SceneNode) => {
      switch (node.type) {
        case 'INSTANCE':
          if (node.mainComponent) idSet.add(node.mainComponent.id);
          return results;
        case 'COMPONENT':
          idSet.add(node.id);
          return results;
        case 'COMPONENT_SET':
          node
            .findChildren(child => child.type === 'COMPONENT')
            .forEach(child => idSet.add(child.id));
          return results;
        default:
          return ('children' in node) ? [...results, ...node.children] : results;
      }
    }, []);
    targets = subNodes;
  }

  return idSet;
}
