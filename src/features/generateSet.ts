export function generateComponentIdSet(input: SceneNode[]): Set<BaseNodeMixin['id']> {
  const result = new Set<BaseNodeMixin['id']>();

  let targets = input;
  while (targets.length > 0) {
    let subNodes: SceneNode[] = [];
    targets.forEach(node => {
      switch (node.type) {
        case 'INSTANCE':
          if (node.mainComponent) result.add(node.mainComponent.id);
          break;
        case 'COMPONENT':
          result.add(node.id);
          break;
        case 'COMPONENT_SET':
          node
            .findChildren(child => child.type === 'COMPONENT')
            .forEach(component => result.add(component.id));
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
  return result;
}
