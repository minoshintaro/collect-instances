export function compareName(a: string, b: string): number {
  return a.localeCompare(b, 'ja-JP-u-co-standard');
}

export function compareNodeByPosition(a: SceneNode, b: SceneNode): number {
  return a.y === b.y ? a.x - b.x : a.y - b.y;
}

export function isFilled(input: MinimalFillsMixin['fills']): boolean {
  return Array.isArray(input) && input.length > 0;
}
