import { PAGE_NAME, FRAME_NAME, FONT_NAME } from "./settings";
import { createAutoLayoutFrame } from "./features/createAutoLayoutFrame";
import { createClone } from "./features/createClone";
import { createComponentMap } from "./features/createComponentMap";
import { createLinkText } from "./features/createLinkText";
import { createPage } from "./features/createPage";

if (figma.currentPage.name === PAGE_NAME) figma.closePlugin('Not Here');

figma.skipInvisibleInstanceChildren = true;

figma.on('run', async ({ command }: RunEvent) => {
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
  const instances = figma.currentPage.findAllWithCriteria({
    types: ['INSTANCE']
  });
  const componentMap = createComponentMap(instances);

  // [3] 処理
  for (const componentSet of componentMap) {
    // 格納先の生成
    const componentFrame = createAutoLayoutFrame({
      target: targetPage,
      name: componentSet[0],
      flow: 'VERTICAL',
      wrap: 'NO_WRAP',
      gap: 20
    });

    // 並び替え、展開
    componentSet[1]
      .sort((a, b) => b.width - a.width)
      .forEach(instance => {
        const cloneNode = createClone(instance);
        componentFrame.appendChild(cloneNode);

        const textNode = createLinkText(instance.id);
        componentFrame.appendChild(textNode);
      });

    // 配置
    targetFrame.appendChild(componentFrame);
  }

  // [4] 当該ページを表示
  figma.currentPage = targetPage;
  figma.closePlugin('Done');
});
