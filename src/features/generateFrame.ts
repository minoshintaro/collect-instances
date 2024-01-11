import { RESULT_NAME, CREATION } from "../settings";
import { createElement } from "./createNode";

export function generateResultContainer(page: PageNode, option: 'partial' | 'full'): FrameNode {
  const { partial, full } = RESULT_NAME.frame;

  let container: FrameNode | null = null;
  let childFrames: FrameNode[] = page ? page.findChildren(node => node.type === 'FRAME') as FrameNode[] : [];
  if (option === 'partial') container = childFrames.find(node => node.name === partial) || null;

  childFrames
    .filter(node => [partial, full].includes(node.name) && node !== container)
    .forEach(node => node.remove());

  if (!container) container = createElement(CREATION.container);
  if (option === 'partial') container.name = partial;

  return container;
}
