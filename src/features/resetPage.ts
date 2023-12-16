export function resetPage(page: PageNode, name: string): void {
  const targets = page.children.filter(child => {
    child.name === name && child.type === 'FRAME';
  });
  targets.forEach(frame => frame.remove());
}
