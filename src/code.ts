import { PAGE_NAME, FRAME_NAME, FONT_NAME } from "./settings";
import { createAutoLayoutFrame } from "./features/createAutoLayoutFrame";
import { createClone } from "./features/createClone";
import { createHeading } from "./features/createHeading";
import { createLink } from "./features/createLink";
import { createPage } from "./features/createPage";
import { generateInstanceMap } from "./features/generateInstanceMap";
import { generateMasterName } from "./features/generateMasterName";

if (figma.currentPage.name === PAGE_NAME) figma.closePlugin('Not Here');

figma.skipInvisibleInstanceChildren = true;
figma.on('run', async () => {
  // [0] 事前処理
  await figma.loadFontAsync(FONT_NAME);

  // [1] 配置先の生成
  const targetPage: PageNode = createPage(PAGE_NAME);
  const layoutFrame: FrameNode = createAutoLayoutFrame({
    target: targetPage,
    name: FRAME_NAME,
    flow: 'HORIZONTAL',
    wrap: 'WRAP',
    gap: 200,
    init: true
  });

  // [2] インスタンスの収集
  // const selectedComponents = figma.currentPage.selection.filter(node => {
  //   switch (node.type) {
  //     case 'INSTANCE': {
  //     }
  //     case 'COMPONENT' {}
  //   }
  // });
  const collectionMap = generateInstanceMap(figma.currentPage.children);

  // [3] 処理
  for (const collection of collectionMap) {
    // [3-1] 格納先の生成
    const componentName = collection[0] ? generateMasterName(collection[0]) : 'Unkown';
    const stackFrame = createAutoLayoutFrame({
      target: targetPage,
      name: componentName,
      flow: 'VERTICAL',
      wrap: 'NO_WRAP',
      gap: 20
    });
    const heading = createHeading(componentName);
    stackFrame.appendChild(heading);

    // [3-2] 並び替え、展開
    collection[1]
      .sort((a, b) => {
        if (a.text < b.text) return -1;
        if (a.text > b.text) return 1;
        return b.node.width - a.node.width;
      })
      .forEach(data => {
        const cloneNode = createClone(data.node);
        const textNode = createLink(data.location);
        stackFrame.appendChild(cloneNode);
        stackFrame.appendChild(textNode);
      });

    // [3-3] 配置
    layoutFrame.appendChild(stackFrame);
  }

  // [4] 当該ページを表示
  figma.currentPage = targetPage;
  figma.closePlugin('Done');
});
