export function createPage(name: string): PageNode {
  // 既存ページ
  const foundPage = figma.root.children.find(page => page.name === name);
  if (foundPage) return foundPage;

  // 新規ページ
  const newPage = figma.createPage();
  newPage.name = name;
  return newPage;
}
