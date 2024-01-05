export function getMasterComponentSet(selection: SceneNode[]): Set<ComponentNode> {
  const componentSet = new Set<ComponentNode>();
  for (const node of selection) {
    switch (node.type) {
      case 'INSTANCE': {
        if (node.mainComponent) componentSet.add(node.mainComponent);
        break;
      }
      case 'COMPONENT_SET': {
        node
          .findChildren(child => child.type === 'COMPONENT')
          .forEach(child => componentSet.add(child as ComponentNode));
        break;
      }
      case 'COMPONENT': {
        componentSet.add(node);
        break;
      }
      default: break;
    }
  }
  return componentSet;
}

export function getMasterName(node: ComponentNode): string {
  return node.parent && node.parent.type === 'COMPONENT_SET' ? node.parent.name : node.name;
}

export function getInnerText(input: InstanceNode): string {
  let result = '';
  input
    .findAllWithCriteria({ types: ['TEXT'] })
    .forEach(node => result += node.characters + ' ');
  return result.trim();
}

export function getFirstNode(node: SceneNode): SceneNode {
  let current = node;
  while (current.parent
    && current.parent.type !== 'DOCUMENT'
    && current.parent.type !== 'PAGE'
    && current.parent.type !== 'SECTION') {
      current = current.parent;
  }
  return current;
}
