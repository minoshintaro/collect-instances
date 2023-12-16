interface CreateAutoLayoutFrame {
  target: PageNode;
  name: string;
  flow: AutoLayoutMixin['layoutMode'];
  gap: number;
}

export function createAutoLayoutFrame(options: CreateAutoLayoutFrame): FrameNode {
  const { target, name, flow, gap } = options;
  const foundFrame = target.children.find(child => child.type === 'FRAME' && child.name === name) as FrameNode;
  if (foundFrame) return foundFrame;

  // 新しいフレームを作成し、自動レイアウトを設定
  const newFrame = figma.createFrame();
  newFrame.name = name;
  newFrame.layoutMode = flow;
  newFrame.counterAxisSizingMode = 'AUTO';
  newFrame.primaryAxisSizingMode = 'AUTO';
  newFrame.itemSpacing = gap;
  newFrame.fills = [];

  target.appendChild(newFrame);
  return newFrame;
}
