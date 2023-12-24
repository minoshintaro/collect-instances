export function getRootFrameName(node: SceneNode): string | null {
  const root = figma.root;
  let current = node;
  while (current.parent && current.parent.type !== 'PAGE' && current.parent.type !== 'SECTION') {
    if (current.parent.type !== root.type) current = current.parent;
  }
  return current.name;
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
