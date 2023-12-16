export function getTargetPage(pageName: string): PageNode {
  const foundPage = figma.root.children.find(page => page.name === pageName);
  if (foundPage) return foundPage;

  const newPage = figma.createPage();
  newPage.name = pageName;
  return newPage;
}
