import { PAGE_NAME, FRAME_NAME, FONT_NAME, BLACK, WHITE } from "./settings";
// import { collectInstances } from "./features/collectInstances";
import { createAutoLayoutFrame } from "./features/createAutoLayoutFrame";
import { createClone } from "./features/createClone";
import { generateInstanceMap } from "./features/generateInstanceMap";
import { generateMasterName } from "./features/generateMasterName";
import { createLinkText } from "./features/createLinkText";
import { createPage } from "./features/createPage";

if (figma.currentPage.name === PAGE_NAME) figma.closePlugin('Not Here');

figma.notify('Doing...');
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
  const collectionMap = generateInstanceMap(figma.currentPage.children);
  // const instances = figma.currentPage.findAllWithCriteria({ types: ['INSTANCE'] });
  // const collectionMap = generateCollectionMap(instances);

  // [3] 処理
  for (const collection of collectionMap) {
    // 格納先の生成
    const componentFrame = createAutoLayoutFrame({
      target: targetPage,
      name: collection[0] ? generateMasterName(collection[0]) : 'Unkown',
      flow: 'VERTICAL',
      wrap: 'NO_WRAP',
      gap: 20
    });

    // 見出し
    const headingBox = figma.createFrame();
    headingBox.name = componentFrame.name;
    headingBox.layoutMode = 'VERTICAL';
    headingBox.counterAxisSizingMode = 'AUTO';
    headingBox.primaryAxisSizingMode = 'AUTO';
    headingBox.paddingTop = 4;
    headingBox.paddingBottom = 4;
    headingBox.paddingLeft = 16;
    headingBox.paddingRight = 16;
    headingBox.cornerRadius = 9999;
    headingBox.fills = BLACK;

    const headingText = figma.createText();
    headingText.fontName = FONT_NAME;
    headingText.fontSize = 24;
    headingText.fills = WHITE;
    headingText.characters = componentFrame.name;
    headingBox.appendChild(headingText);
    componentFrame.appendChild(headingBox);

    // 並び替え、展開
    collection[1]
      .sort((a, b) => b.width - a.width)
      .forEach(instance => {
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

