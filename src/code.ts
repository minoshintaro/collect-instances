import { MasterNameMap } from "./types";
import { CREATION, PAGE_NAME, FRAME_NAME, FONT_NAME } from "./settings";
import { createInstanceCatalog } from "./features/createInstanceCatalog";
import { createPage, createElement } from "./features/createNode";
import { findPage, findFrame } from "./features/find";
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

    // [2] データの準備
    const data = await Promise.all([
      createInstanceCatalog(figma.currentPage),
      figma.loadFontAsync(FONT_NAME)
    ]);

    // [3] データの処理
    const target: PageNode = findPage(PAGE_NAME) || createPage(PAGE_NAME);
    // findFrame({ name: FRAME_NAME, page: target, init: true }) ||
    const container: FrameNode = createElement(CREATION.container); // hidden
    const instanceCatalog = data[0];
    await layoutClonedInstances({
      page: target,
      frame: container,
      data: instanceCatalog
    });

    // [4] 移動
    figma.currentPage = target;
    figma.viewport.scrollAndZoomIntoView([container]);
    container.visible = true;

    // [5] 完了
    end = new Date();
    console.log('Time:', `${end.getTime() - start.getTime()}ms`, instanceCatalog);

    figma.closePlugin('Done')
  } catch (error) {
    figma.closePlugin(`${error instanceof Error ? error.message : 'Error'}`);
  }
});

// [5] 結果に移動
//  figma.currentPage = target.page;
//  figma.viewport.scrollAndZoomIntoView([containerLayout]);
//  target.page.appendChild(containerLayout);
//  containerLayout.x -= containerLayout.width / 2;
//  containerLayout.y -= containerLayout.height / 2;
//  containerLayout.visible = true;
