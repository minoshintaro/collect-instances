import { ComponentCatalog } from "./types";
import { NAME, ROBOT_R, ROBOT_B } from "./settings";
import { createInstanceCatalog } from "./features/createInstanceCatalog";
import { findPage } from "./features/find";
import { generateResultContainer } from "./features/generateResultContainer";
import { getTime } from "./features/get";
import { layoutInstanceCatalog } from "./features/layoutInstanceCatalog";
import { createPage, setFrame } from "./features/oparateNode";

let start = new Date();
// let end = new Date();

figma.skipInvisibleInstanceChildren = true;

figma.on('run', async () => {
  try {
    // [0] 中断の是非
    if (figma.currentPage.name === NAME.page) {
      figma.closePlugin('Not Here');
      return;
    }

    // [1] 事前処理
    figma.notify('Collecting...', { timeout: 800 });
    await Promise.all([
      figma.loadFontAsync(ROBOT_R),
      figma.loadFontAsync(ROBOT_B),
      new Promise(resolve => setTimeout(resolve, 400)) // 通知待機用
    ]);

    // [2] データの準備
    let instances: InstanceNode[] = figma.currentPage.findAllWithCriteria({ types: ['INSTANCE'] });
    let selection: readonly SceneNode[] = figma.currentPage.selection; // selection: ReadonlyArray<SceneNode>
    let data: ComponentCatalog = createInstanceCatalog(instances, selection);
    console.log('Time:', getTime(start, new Date()), data);

    // [3] データの処理
    const targetPage: PageNode = findPage(NAME.page) || createPage(NAME.page);
    const container: FrameNode = generateResultContainer(targetPage, selection.length ? 'partial' : 'full');
    layoutInstanceCatalog({ container, data });

    // [4] 結果
    setFrame(container, { parent: targetPage, visible: true });
    figma.currentPage = targetPage;
    figma.viewport.scrollAndZoomIntoView([container]);

    // 事後処理
    const count = data.component.size;
    data.index.clear();
    data.component.clear();
    data.instance.clear();
    instances = [];
    selection = [];

    // 終了
    figma.closePlugin(`Collected ${count} instances`);
    console.log('Finish Time:', getTime(start, new Date()));
  } catch (error) {
    figma.closePlugin(`${error instanceof Error ? error.message : 'Error'}`);
  }
});
