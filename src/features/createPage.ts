export function createPage(name: string): PageNode {
  const newPage = figma.createPage();
  newPage.name = name;
  return newPage;
}
