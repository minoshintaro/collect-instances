import { createAutoLayoutFrame } from "./features/createAutoLayoutFrame";
import { createPage } from "./features/createPage";
import { getInstanceMap } from "./features/getInstanceMap";

const PAGE_NAME = "Instances";
const FRAME_NAME = "Collections";

figma.skipInvisibleInstanceChildren = true;

figma.on('run', ({ command }: RunEvent) => {

  // 配置先の確保
  const targetPage: PageNode = createPage(PAGE_NAME);
  if (figma.currentPage === targetPage) figma.closePlugin('Not Here');

  const targetFrame: FrameNode = createAutoLayoutFrame({
    target: targetPage,
    name: FRAME_NAME,
    flow: 'HORIZONTAL',
    gap: 200
  });

  // インスタンスの複製
  const componentFrames: FrameNode[] = [];
  const instanceMap = getInstanceMap();

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

  figma.currentPage = targetPage;
  figma.closePlugin('Done');
});

