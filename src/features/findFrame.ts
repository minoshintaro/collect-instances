import { LayoutFramePorps } from "../tyes";

export function findFrame(props: LayoutFramePorps, option: string): FrameNode | null {
  const { target, name } = props;
  const foundFrame = target.children.find(child => child.name === name && child.type === 'FRAME') as FrameNode;

  if (!foundFrame) return null;
  if (option === 'init') {
    while (foundFrame.children.length > 0) {
      foundFrame.children[0].remove();
    }
  }
  return foundFrame;
}
