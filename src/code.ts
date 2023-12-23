import { LayoutFramePorps } from "./tyes";
import { PAGE_NAME, FRAME_NAME, FONT_NAME } from "./settings";
import { createAutoLayoutFrame } from "./features/createAutoLayoutFrame";
import { createClone } from "./features/createClone";
import { createHeading } from "./features/createHeading";
import { createLink } from "./features/createLink";
import { createPage } from "./features/createPage";
import { findFrame } from "./features/findFrame";
import { findPage } from "./features/findPage";
import { generateInstanceMap } from "./features/generateInstanceMap";
import { generateMasterName } from "./features/generateMasterName";

if (figma.currentPage.name === PAGE_NAME) figma.closePlugin('Not Here');

figma.skipInvisibleInstanceChildren = true;

figma.on('run', async () => {
  // [0] 事前処理
  figma.notify('Doing...');
  await figma.loadFontAsync(FONT_NAME);

  // [1] 配置先の生成
  const targetPage: PageNode = findPage(PAGE_NAME) || createPage(PAGE_NAME);
  const layoutFrameProps: LayoutFramePorps = {
    target: targetPage,
    name: FRAME_NAME,
    flow: 'HORIZONTAL',
    wrap: 'WRAP',
    gap: 200
  };
  const layoutFrame: FrameNode = findFrame(layoutFrameProps, 'init') || createAutoLayoutFrame(layoutFrameProps);

  // [2] インスタンスの収集
  const collectionMap = generateInstanceMap(figma.currentPage.children);

  // [3] 繰り返し処理
  for (const collection of collectionMap) {
    const masterComponent = collection[0];
    const instances = collection[1]

    // [3-1] 格納先の生成
    const masterName = masterComponent ? generateMasterName(masterComponent) : 'Unkown';
    const stackFrame = createAutoLayoutFrame({
      target: targetPage,
      name: masterName,
      flow: 'VERTICAL',
      wrap: 'NO_WRAP',
      gap: 20
    });
    const heading = createHeading(masterName);
    stackFrame.appendChild(heading);

    // [3-2] 並び替え、展開
    instances
      .sort((a, b) => {
        if (a.text < b.text) return -1;
        if (a.text > b.text) return 1;
        return b.node.width - a.node.width;
      })
      .forEach(instance => {
        const cloneNode = createClone(instance.node);
        const textNode = createLink(instance.location);
        stackFrame.appendChild(cloneNode);
        stackFrame.appendChild(textNode);
      });

    // [3-3] 配置
    layoutFrame.appendChild(stackFrame);
  }

  const sorted = [...layoutFrame.children].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  sorted.forEach(frame => layoutFrame.appendChild(frame));

  // [4] 当該ページを表示
  figma.currentPage = targetPage;
  figma.closePlugin('Done');
});
