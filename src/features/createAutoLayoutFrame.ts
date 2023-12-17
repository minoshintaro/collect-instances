interface CreateAutoLayoutFrame {
  target: PageNode;
  name: string;
  flow: AutoLayoutMixin['layoutMode'];
  wrap: AutoLayoutMixin['layoutWrap'];
  gap: number;
  init?: boolean; // Optional
}

export function createAutoLayoutFrame(options: CreateAutoLayoutFrame): FrameNode {
  const { target, name, flow, wrap, gap, init } = options;

  // 既存フレーム
  const foundFrame = target.children.find(child => child.name === name && child.type === 'FRAME') as FrameNode;
  if (foundFrame) {
    if (init) {
      while (foundFrame.children.length > 0) {
        foundFrame.children[0].remove();
      }
    }
    return foundFrame;
  }

  // 新規フレーム
  const newFrame = figma.createFrame();
  newFrame.name = name;
  newFrame.layoutMode = flow;
  newFrame.layoutWrap = wrap;
  newFrame.counterAxisSizingMode = 'AUTO';
  newFrame.primaryAxisSizingMode = 'AUTO';
  newFrame.itemSpacing = gap;
  newFrame.maxWidth = 99999;
  newFrame.fills = [];

  target.appendChild(newFrame);
  return newFrame;
}
