import { LayoutFramePorps, InstanceData } from "./types";
import { PAGE_NAME, FRAME_NAME, FONT_NAME, HEADING_THEME, LINK_THEME } from "./settings";
import { createAutoLayoutFrame } from "./features/createAutoLayoutFrame";
import { createClone } from "./features/createClone";
import { createLabel } from "./features/createLabel";
import { createPage } from "./features/createPage";
import { findFrame } from "./features/findFrame";
import { findPage } from "./features/findPage";
import { generateInstanceMap } from "./features/generateInstanceMap";
import { generateMasterName } from "./features/generateMasterName";
import { getMasterComponents } from "./features/getMasterComponents";

async function collectInstances() {
  const selectedNodes: ComponentNode[] = getMasterComponents(figma.currentPage.selection);

  // [1] 配置先の生成
  const targetPage: PageNode = findPage(PAGE_NAME) || createPage(PAGE_NAME);
  const layoutFrameProps: LayoutFramePorps = {
    parent: targetPage,
    name: FRAME_NAME,
    flow: 'HORIZONTAL',
    wrap: 'WRAP',
    gap: 200
  };
  const layoutFrame: FrameNode = findFrame(layoutFrameProps, 'init') || createAutoLayoutFrame(layoutFrameProps);

  // [2] インスタンスの収集
  // let allNodes: SceneNode[] = [];
  // figma.root.children.forEach(page => {
  //   allNodes = allNodes.concat(page.children);
  // });

  const collectionMap = generateInstanceMap({
    targets: figma.currentPage.children,
    scopes: selectedNodes
  });

  // [3] 繰り返し処理
  // let count: number = 0;
  for (const collection of collectionMap) {
    const masterComponent: ComponentNode | null = collection[0];
    const instances: InstanceData[] = collection[1]

    // [3-1] 格納先の生成
    const masterName: string = masterComponent ? generateMasterName(masterComponent) : 'Unkown';
    const stackFrame: FrameNode = createAutoLayoutFrame({
      parent: layoutFrame,
      name: masterName,
      flow: 'VERTICAL',
      wrap: 'NO_WRAP',
      gap: 20
    });
    const heading: FrameNode = createLabel({
      parent: stackFrame,
      name: masterName,
      theme: HEADING_THEME
    });

    // [3-2] 並び替え、展開
    instances
      .sort((a, b) => {
        if (a.text < b.text) return -1;
        if (a.text > b.text) return 1;
        return b.node.width - a.node.width;
      })
      .forEach(instance => {
        const cloneNode = createClone({
          parent: stackFrame,
          node: instance.node
        });
        const linkNode = createLabel({
          parent: stackFrame,
          name: instance.location.name,
          link: instance.node,
          theme: LINK_THEME
        });
      });
    // count = count + instances.length;
  }
  // console.log('test', count);

  // [4] コンポーネント名で並び替え
  [...layoutFrame.children]
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(frame => layoutFrame.appendChild(frame));

  // [5] 移動
  figma.currentPage = targetPage;
}

figma.on('run', async () => {
  try {
    if (figma.currentPage.name === PAGE_NAME) figma.closePlugin('Not Here');
    figma.notify('Doing...', { timeout: 2000 });
    figma.skipInvisibleInstanceChildren = true;

    await figma.loadFontAsync(FONT_NAME);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await collectInstances();

    figma.closePlugin('Done')
  } catch (error) {
    figma.closePlugin(`${error instanceof Error ? error.message : 'Error'}`);
  }
});
