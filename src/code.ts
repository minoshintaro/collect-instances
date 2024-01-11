import { NodeGroup, MasterNameMap } from "./types";
import { RESULT_NAME, FONT_NAME } from "./settings";
import { createInstanceCatalog } from "./features/createInstanceCatalog";
import { createPage } from "./features/createNode";
import { findPage } from "./features/find";
import { generateResultContainer } from "./features/GenerateFrame";
import { getNodesOnPage, getTime } from "./features/get";
import { layoutClonedInstances } from "./features/layoutClonedInstances";
import { countInstances } from "./features/utilities";

let start = new Date();
let end = new Date();

figma.on('run', async () => {
  try {
    // [0] 中断の是非
    if (figma.currentPage.name === RESULT_NAME.page) {
      figma.closePlugin('Not Here');
      return;
    }

    // [1] 事前処理
    figma.skipInvisibleInstanceChildren = true;
    figma.notify('Collecting...', { timeout: 800 });
    await new Promise(resolve => setTimeout(resolve, 400)); // 通知待ち用
    await figma.loadFontAsync(FONT_NAME);

    // [2] データの準備
    let nodes: NodeGroup | null = getNodesOnPage(figma.currentPage);
    let data: MasterNameMap | null = createInstanceCatalog(nodes);

    // console.log('Time:', getTime(start, new Date()), data);

    // [3] データの処理
    const targetPage: PageNode = findPage(RESULT_NAME.page) || createPage(RESULT_NAME.page);
    const container: FrameNode = generateResultContainer(targetPage, nodes.selection.length ? 'partial' : 'full');
    await layoutClonedInstances({ page: targetPage, frame: container, data });

    // [4] 結果
    figma.currentPage = targetPage;
    figma.viewport.scrollAndZoomIntoView([container]);
    container.visible = true;
    const count = countInstances(data);
    // console.log('Time:', getTime(start, new Date()));

    nodes = null;
    data = null;
    figma.closePlugin(`Collected ${count} instances`);
  } catch (error) {
    figma.closePlugin(`${error instanceof Error ? error.message : 'Error'}`);
  }
});
