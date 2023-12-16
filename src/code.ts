import { PAGE_NAME, FRAME_NAME } from "./settings";
import { createAutoLayoutFrame } from "./features/createAutoLayoutFrame";
import { createPage } from "./features/createPage";
import { setMap } from "./features/setMap";

figma.skipInvisibleInstanceChildren = true;

figma.on('run', ({ command }: RunEvent) => {
  // 配置先
  const targetPage: PageNode = createPage(PAGE_NAME);
  if (figma.currentPage === targetPage) figma.closePlugin('Not Here');

  const targetFrame: FrameNode = createAutoLayoutFrame({
    target: targetPage,
    name: FRAME_NAME,
    flow: 'HORIZONTAL',
    gap: 200
  });

  // インスタンス
  const instances = figma.currentPage.findAllWithCriteria({
    types: ['INSTANCE']
  });
  const instanceMap = setMap(instances);
  const componentFrames: FrameNode[] = [];

  instanceMap.forEach((values, key) => {
    const componentFrame = createAutoLayoutFrame({
      target: targetPage,
      name: key,
      flow: 'VERTICAL',
      gap: 20
    });
    values.forEach(instance => {
      const clone = instance.clone();
      componentFrame.appendChild(clone);
    });
    componentFrames.push(componentFrame);
  });

  componentFrames.forEach(frame => {
    targetFrame.appendChild(frame);
  });

  // 当該ページを表示
  figma.currentPage = targetPage;

  figma.closePlugin('Done');
});

