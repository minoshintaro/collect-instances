import { NAME, ROBOTO_R, ROBOTO_B } from "./settings";
import { Catalog, generateCatalog } from "./features/generateCatalog";
import { generateResultFrame } from "./features/generateResultFrame";
import { getTime } from "./features/get";
import { getComponentIdSet } from "./features/getComponentIdSet";
import { layoutInstances } from "./features/layoutInstances";
import { createPage, findPage, setFrame } from "./features/oparateNode";

let start = new Date();
// let end = new Date();

figma.skipInvisibleInstanceChildren = true;

figma.on('run', async () => {
  try {
    /** [0] 中断の是非 */
    if (figma.currentPage.name === NAME.page) {
      figma.closePlugin('Not Here');
      return;
    }

    /** [1] 事前処理 */
    figma.notify('Collecting...', { timeout: 500 });

    await Promise.all([
      figma.loadFontAsync(ROBOTO_R),
      figma.loadFontAsync(ROBOTO_B),
      new Promise(resolve => setTimeout(resolve, 500)) // 通知待機用
    ]);
    console.log('Time:', getTime(start, new Date()));

    /** [2] データの準備 */
    let allInstances: InstanceNode[] = figma.currentPage.findAllWithCriteria({ types: ['INSTANCE'] });
    let selectedComponentIdSet: Set<string> = getComponentIdSet(figma.currentPage.selection);
    let catalog: Catalog = generateCatalog(allInstances, selectedComponentIdSet);
    console.log('Time:', getTime(start, new Date()), catalog);

    /** [3] データの処理 */
    const resultPage: PageNode = findPage(NAME.page) || createPage(NAME.page);
    const resultFrame: FrameNode = generateResultFrame(resultPage, selectedComponentIdSet.size > 0 ? 'partial' : 'full');
    layoutInstances({ container: resultFrame, data: catalog });

    /** [4] 結果 */
    setFrame(resultFrame, { parent: resultPage, visible: true });
    figma.currentPage = resultPage;
    figma.viewport.scrollAndZoomIntoView([resultFrame]);

    const count = 1;
    // const count = catalog.example.size;
    allInstances = [];
    selectedComponentIdSet.clear();
    catalog.index = [];
    catalog.components.clear();

    /** [5] 終了 */
    console.log('Finish Time:', getTime(start, new Date()));
    figma.closePlugin(`Collected ${count} instances`);
  } catch (error) {
    figma.closePlugin(`${error instanceof Error ? error.message : 'Error'}`);
  }
});
