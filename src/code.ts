import { PAGE_NAME, FRAME_NAME, FONT_NAME } from "./settings";
import { createAutoLayoutFrame } from "./features/createAutoLayoutFrame";
import { createHeading } from "./features/createHeading";
import { createClone } from "./features/createClone";
import { generateInstanceMap } from "./features/generateInstanceMap";
import { generateMasterName } from "./features/generateMasterName";
import { createLinkText } from "./features/createLinkText";
import { createPage } from "./features/createPage";

if (figma.currentPage.name === PAGE_NAME) figma.closePlugin('Not Here');

figma.skipInvisibleInstanceChildren = true;
figma.on('run', async () => {

  await figma.loadFontAsync(FONT_NAME);

  // [1] 配置先の生成
  const targetPage: PageNode = createPage(PAGE_NAME);
  const targetFrame: FrameNode = createAutoLayoutFrame({
    target: targetPage,
    name: FRAME_NAME,
    flow: 'HORIZONTAL',
    wrap: 'WRAP',
    gap: 200,
    init: true
  });

  // [2] インスタンスの収集
  const collectionMap = generateInstanceMap(figma.currentPage.children);

  // [3] 処理
  for (const collection of collectionMap) {
    // 格納先の生成
    const componentName = collection[0] ? generateMasterName(collection[0]) : 'Unkown';
    const componentFrame = createAutoLayoutFrame({
      target: targetPage,
      name: componentName,
      flow: 'VERTICAL',
      wrap: 'NO_WRAP',
      gap: 20
    });
    const heading = createHeading(componentName);
    componentFrame.appendChild(heading);

    // 並び替え、展開
    collection[1]
      .sort((a, b) => b.width - a.width)
      .forEach(instance => {
        console.log('test', instance.id, instance.name);

        const cloneNode = createClone(instance);
        componentFrame.appendChild(cloneNode);

        const textNode = createLinkText(instance);
        componentFrame.appendChild(textNode);
      });

    // 配置
    targetFrame.appendChild(componentFrame);
  }

  // [4] 当該ページを表示
  figma.currentPage = targetPage;
  figma.closePlugin('Done');
});
