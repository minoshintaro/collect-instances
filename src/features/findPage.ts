export function findPage(name: string): PageNode | null {
  const foundPage = figma.root.findChild(child => child.name === name);
  return foundPage || null;
}
