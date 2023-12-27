export function sortComponentsByName(nodes: ComponentNode[]): ComponentNode[] {
  return nodes.sort((a, b) => {
    return a.name.localeCompare(b.name, 'ja-JP-u-co-standard');
  });
}
