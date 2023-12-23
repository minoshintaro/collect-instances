export function getContainerNode(node: SceneNode): SceneNode {
  const root = figma.root;
  let current = node;
  while (current.parent && current.parent.type !== 'PAGE' && current.parent.type !== 'SECTION') {
    if (current.parent.type !== root.type) current = current.parent;
  }
  return current;
}
