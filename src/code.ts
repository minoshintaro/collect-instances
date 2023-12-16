import { getAutoLayoutFrame } from "./features/getAutoLayoutFrame";
import { getTargetPage } from "./features/getTargetPage";
import { getInstances } from "./features/getInstances";

const PAGE_NAME = "Instances";
const FRAME_NAME = "Collection";

figma.skipInvisibleInstanceChildren = true;

figma.on('run', ({ command }: RunEvent) => {
  const targetPage = getTargetPage(PAGE_NAME);
  const targetFrame = getAutoLayoutFrame(FRAME_NAME, targetPage);
  const instances = getInstances();
  console.log('test', instances);

  instances.forEach(instance => {
    const clone = instance.clone();
    targetFrame.appendChild(clone);
  });

  figma.closePlugin('Done');
});

