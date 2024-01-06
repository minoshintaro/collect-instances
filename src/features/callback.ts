export function compareWordOrder(a: string, b: string): number {
  return a.localeCompare(b, 'ja-JP-u-co-standard');
}
