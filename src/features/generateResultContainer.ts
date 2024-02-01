import { RESULT_NAME, LAYOUT } from "../settings";
import { createFrame } from "./oparateNode";

export function generateResultContainer(page: PageNode, option: 'partial' | 'full'): FrameNode {
  let result: FrameNode | null = null;

  // partialなら、
  // ・既存フレームがfull用なら削除して新設
  // ・既存フレームがpartial用なら継承
  // fullなら、既存フレームを削除して新設

  // 既存フレームを走査した結果、
  // ・フレームがない
  // ・フレームがある
  // 　・full用がある
  // 　・partial用がある
  // 　・それ以外がある
  //  　.すべてあてはまる

  let childFrames: FrameNode[] = page ? page.findChildren(node => node.type === 'FRAME') as FrameNode[] : [];
  if (option === 'partial') result = childFrames.find(node => node.name === RESULT_NAME.frame.partial) || null;

  childFrames
    .filter(node => [RESULT_NAME.frame.partial, RESULT_NAME.frame.full].includes(node.name) && node !== result)
    .forEach(node => node.remove());

  if (!result) result = createFrame({ name: RESULT_NAME.frame.full, layout: LAYOUT.container });
  if (option === 'partial') result.name = RESULT_NAME.frame.partial;

  return result;
}

function test(input: PageNode, option: 'partial' | 'full'): FrameNode {
  let result: FrameNode | null = null;

  // 子ノードから既存フレームを探す
  const children: SceneNode[] = input.findChildren(node => {
    return node.type === 'FRAME' && [RESULT_NAME.frame.full, RESULT_NAME.frame.partial].includes(node.name);
  });

  // 全取っ替え、または

  if (option === 'partial') {
    children.forEach(node => {
      if (node.name === RESULT_NAME.frame.full) node.remove();
      if (node.name === RESULT_NAME.frame.partial && !result) result = node as FrameNode;
    });
  }

  // 全取っ替え
  if (option === 'full') {
    children.forEach(node => node.remove());
  }
  return result ? result : createFrame({ name: RESULT_NAME.frame.full, layout: LAYOUT.container });;
}
