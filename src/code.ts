import { NAME, ROBOTO_R, ROBOTO_B } from "./settings";
import { Catalog, generateCatalog } from "./features/generateCatalog";
import { generateComponentIdSet } from "./features/generateComponentIdSet";
import { generateResultFrame } from "./features/generateResultFrame";
import { getTime } from "./features/get";
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
    let instances: InstanceNode[] = figma.currentPage.findAllWithCriteria({ types: ['INSTANCE'] });
    let selectionIdSet: Set<string> = generateComponentIdSet(figma.currentPage.selection);
    let catalog: Catalog = generateCatalog(instances, selectionIdSet);
    console.log('Time:', getTime(start, new Date()), catalog);

    /** [3] データの処理 */
    const resultPage: PageNode = findPage(NAME.page) || createPage(NAME.page);
    const resultFrame: FrameNode = generateResultFrame(resultPage, selectionIdSet.size > 0 ? 'partial' : 'full');
    layoutInstances({ container: resultFrame, data: catalog });

    /** [4] 結果 */
    setFrame(resultFrame, { parent: resultPage, visible: true });
    figma.currentPage = resultPage;
    figma.viewport.scrollAndZoomIntoView([resultFrame]);

    const count = 1;
    // const count = catalog.example.size;
    instances = [];
    selectionIdSet.clear();
    catalog.index = [];
    catalog.components.clear();

    /** [5] 終了 */
    figma.closePlugin(`Collected ${count} instances`);
    console.log('Finish Time:', getTime(start, new Date()));
  } catch (error) {
    figma.closePlugin(`${error instanceof Error ? error.message : 'Error'}`);
  }
});
