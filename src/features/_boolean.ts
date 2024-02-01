export function isVisible(input: SceneNode): boolean {
  if (input.visible) {
    let current = input;
    while (current.parent) {
      const { parent } = current;
      if (parent.type === 'PAGE') return true;
      if ('visible' in parent && parent.visible) current = parent;
    }
  }
  return false;
}
