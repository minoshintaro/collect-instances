export function findPage(name: string): PageNode | null {
  return figma.root.findChild(child => child.name === name);
}

interface Options {
  name: string;
  page: PageNode;
  init: boolean;
}
export function findFrame(options: Options): FrameNode | null {
  const { name, page, init } = options;
  const foundFrames = page.findChildren(node => node.name === name && node.type === 'FRAME') as FrameNode[];
  if (init) {
    foundFrames.forEach(frame => frame.remove());
    return null;
  } else {
    return foundFrames[0];
  }
}
