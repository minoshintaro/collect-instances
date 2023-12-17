import { PAGE_NAME, FRAME_NAME } from "./settings";
import { createAutoLayoutFrame } from "./features/createAutoLayoutFrame";
import { createPage } from "./features/createPage";
import { setComponentMap } from "./features/setComponentMap";
import { setHyperlink } from "./features/setHyperLink";

if (figma.currentPage.name === PAGE_NAME) figma.closePlugin('Not Here');

figma.skipInvisibleInstanceChildren = true;

figma.on('run', async ({ command }: RunEvent) => {
  // 配置先
  const targetPage: PageNode = createPage(PAGE_NAME);
  const targetFrame: FrameNode = createAutoLayoutFrame({
    target: targetPage,
    name: FRAME_NAME,
    flow: 'HORIZONTAL',
    wrap: 'WRAP',
    gap: 200,
    init: true
  });

  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });

  // インスタンス集
  const instances = figma.currentPage.findAllWithCriteria({
    types: ['INSTANCE']
  });
  const componentMap = setComponentMap(instances);

  // 処理
  for (const componentSet of componentMap) {
    // 格納先
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
        const { name, id, width, height } = instance;

        // 複製
        const cloneNode = instance.clone();
        cloneNode.resize(width, height);
        cloneNode.layoutPositioning = 'AUTO';

        // リンク
        const textNode = figma.createText();
        textNode.fontName = { family: "Roboto", style: "Regular" };
        textNode.fontSize = 18;
        textNode.textDecoration = 'UNDERLINE';
        textNode.characters = 'LINK';
        setHyperlink(textNode, id);

        // 配置
        componentFrame.appendChild(cloneNode);
        componentFrame.appendChild(textNode);
        targetFrame.appendChild(componentFrame);
      });

  }



  // const componentFrames: FrameNode[] = [];
//
  // componentMap.forEach((values, key) => {
  //   const componentFrame = createAutoLayoutFrame({
  //     target: targetPage,
  //     name: key,
  //     flow: 'VERTICAL',
  //     gap: 20
  //   });
  //   values.forEach(instance => {
  //     const clone = instance.clone();
  //     clone.resize(instance.width, instance.height);
  //     componentFrame.appendChild(clone);
  //   });
  //   componentFrames.push(componentFrame);
  // });
//
  // componentFrames.forEach(frame => {
  //   targetFrame.appendChild(frame);
  // });

  // 当該ページを表示
  figma.currentPage = targetPage;

  figma.closePlugin('Done');
});

