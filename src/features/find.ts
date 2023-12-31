import { ExistingFrame } from "../types";

export function findPage(name: string): PageNode | null {
  const foundPage = figma.root.findChild(child => child.name === name);
  return foundPage || null;
}

export function findFrame(props: ExistingFrame): FrameNode | null {
  const { name, parent, init } = props;
  const isExisting = (node: SceneNode): boolean => node.name === name && node.type === 'FRAME';

  if (init) {
    parent.findChildren(isExisting).forEach(node => node.remove());
    return null;
  }

  const child = parent.findChild(isExisting) as FrameNode;
  return child || null;
}
