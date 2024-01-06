import { MasterNameMap } from "./types";
import { CREATION, PAGE_NAME, FRAME_NAME, FONT_NAME } from "./settings";
import { createInstanceCatalog } from "./features/createInstanceCatalog";
import { createPage, createElement } from "./features/createNode";
import { findPage, findFrame } from "./features/find";
import { generateComponentSet } from "./features/generateSet";
import { layoutClonedInstances } from "./features/layoutClonedInstances";

let start = new Date();
let end = new Date();

figma.on('run', async () => {
  try {
    start = new Date();

    // [0] 中断の是非
    if (figma.currentPage.name === PAGE_NAME) {
      figma.closePlugin('Not Here');
      return;
    }

    // [1] 事前処理
    figma.notify('Doing...', { timeout: 1000 });
    figma.skipInvisibleInstanceChildren = true;
    await new Promise(resolve => setTimeout(resolve, 500));

    // [2] ノードの宣言
    const target: PageNode = findPage(PAGE_NAME) || createPage(PAGE_NAME);
    const scope: Set<ComponentNode> = generateComponentSet(figma.currentPage.selection);
    const container: FrameNode = findFrame({ name: FRAME_NAME, page: target, init: !scope.size }) || createElement(CREATION.container);

    // [3] データの準備
    const data = await Promise.all([
      createInstanceCatalog(figma.currentPage, scope),
      figma.loadFontAsync(FONT_NAME)
    ]);
    const instanceCatalog: MasterNameMap = data[0];

    // [4] データの処理
    await layoutClonedInstances({
      page: target,
      frame: container,
      data: instanceCatalog
    });

    // [5] 結果
    figma.currentPage = target;
    figma.viewport.scrollAndZoomIntoView([container]);
    container.visible = true;

    end = new Date();
    console.log('Time:', `${end.getTime() - start.getTime()}ms`, instanceCatalog);

    // [6] 完了
    figma.closePlugin('Done')
  } catch (error) {
    figma.closePlugin(`${error instanceof Error ? error.message : 'Error'}`);
  }
});
