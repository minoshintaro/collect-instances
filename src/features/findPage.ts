export function findPage(name: string): PageNode | null {
  const foundPage = figma.root.children.find(page => page.name === name);
  return foundPage || null;
}
