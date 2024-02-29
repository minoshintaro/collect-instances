import { NAME, LAYOUT } from "../settings";
import { createFrame } from "./oparateNode";

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
//
// export function generateResultContainer1(page: PageNode, option: 'partial' | 'full'): FrameNode {
//   let result: FrameNode | null = null;

//   let childFrames: FrameNode[] = page ? page.findChildren(node => node.type === 'FRAME') as FrameNode[] : [];
//   if (option === 'partial') result = childFrames.find(node => node.name === NAME.frame.partial) || null;
//
//   childFrames
//     .filter(node => [NAME.frame.partial, NAME.frame.full].includes(node.name) && node !== result)
//     .forEach(node => node.remove());
//
//   if (!result) result = createFrame({ name: NAME.frame.full, layout: LAYOUT.container });
//   if (option === 'partial') result.name = NAME.frame.partial;
//
//   return result;
// }

export function generateResultFrame(input: PageNode, option: 'partial' | 'full'): FrameNode {
  const foundFrameNodes: SceneNode[] = input.findChildren(node => {
    return node.type === 'FRAME' && [NAME.frame.full, NAME.frame.partial].includes(node.name);
  });

  const targetNodes = foundFrameNodes.reduce((results: SceneNode[], node) => {
    if (option === 'full' || (option === 'partial' && node.name === NAME.frame.full)) {
      node.remove();
    } else if (option === 'partial' && node.name === NAME.frame.partial) {
      results.push(node);
    }
    return results;
  }, []);

  return targetNodes.length > 0 && targetNodes[0].type === 'FRAME'
    ? targetNodes[0]
    : createFrame({ name: NAME.frame[option], layout: LAYOUT.container });
}
