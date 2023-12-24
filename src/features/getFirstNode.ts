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
