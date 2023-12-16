import { resetPage } from "./resetPage";

export function createPage(name: string): PageNode {
  const foundPage = figma.root.children.find(page => page.name === name);
  if (foundPage) {
    resetPage(foundPage);
    return foundPage;
  }

  // 新規ページを作成
  const newPage = figma.createPage();
  newPage.name = name;
  return newPage;
}
