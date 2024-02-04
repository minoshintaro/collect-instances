export function compareWordOrder(a: string, b: string): number {
  return a.localeCompare(b, 'ja-JP-u-co-standard');
}

export function cutText(text: string, max: number) {
  if (text.length > max) return text.slice(0, max);
  return text;
}
