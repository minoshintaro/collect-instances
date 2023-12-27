import { ElementProps } from "../types";

export function findFrame(props: ElementProps, init: boolean): FrameNode | null {
  const { parent, name } = props;
  const foundFrame = parent
    ? parent.children.find(child => child.name === name && child.type === 'FRAME') as FrameNode
    : null;

  if (foundFrame && init) {
    while (foundFrame.children.length > 0) {
      foundFrame.children[0].remove();
    }
  }

  return foundFrame || null;
}
