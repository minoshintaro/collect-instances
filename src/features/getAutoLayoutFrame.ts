export function getAutoLayoutFrame(frameName: string, page: PageNode): FrameNode {
  const foundFrame = page.children.find(child => child.type === 'FRAME' && child.name === frameName) as FrameNode;
  if (foundFrame) return foundFrame;

  // 新しいフレームを作成し、自動レイアウトを設定
  const newFrame = figma.createFrame();
  newFrame.name = frameName;
  newFrame.layoutMode = 'VERTICAL';
  newFrame.counterAxisSizingMode = 'AUTO';
  newFrame.primaryAxisSizingMode = 'AUTO';
  newFrame.itemSpacing = 40;
  newFrame.fills = [];

  page.appendChild(newFrame);
  return newFrame;
}
