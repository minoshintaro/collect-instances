export function findPage(input: string): PageNode | null {
  return figma.root.findChild(child => child.name === input);
}
