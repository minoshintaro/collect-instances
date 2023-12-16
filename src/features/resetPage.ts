export function resetPage(page: PageNode): void {
  [...page.children].forEach(node => node.remove());
}
