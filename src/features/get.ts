export function getMasterName(node: ComponentNode): string {
  return node.parent && node.parent.type === 'COMPONENT_SET' ? node.parent.name : node.name;
}

export function getInnerText(input: InstanceNode): string {
  let text = '';
  input
    .findAllWithCriteria({ types: ['TEXT'] })
    .forEach(node => text += node.characters + ' ');
  return text.trim();
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
