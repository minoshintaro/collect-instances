import { Target, CreationProps, InstanceCatalog, InstanceData } from "./types";
import { PAGE_NAME, FRAME_NAME, FONT_NAME, LINK_COLOR, LIGHT_GRAY, BLACK, WHITE } from "./settings";
import { createElement } from "./features/createElement";
import { createPage } from "./features/createPage";
import { findFrame } from "./features/findFrame";
import { findPage } from "./features/findPage";
import { generateInstanceCatalog } from "./features/generateInstanceCatalog";
import { generateMasterName } from "./features/generateMasterName";
import { getMasterComponents } from "./features/getMasterComponents";
import { setTextProps } from "./features/setTextProps";
import { sortComponentsByName } from "./features/sortByName";

async function collectInstances() {
  // [0] 設定
  const target: Target = {
    page: findPage(PAGE_NAME) || createPage(PAGE_NAME),
    nodes: [...figma.currentPage.children],
    selection: getMasterComponents([...figma.currentPage.selection])
  }
  const creation: CreationProps = {
    layoutFrame: {
      name: FRAME_NAME,
      layout: { flow: 'WRAP', gap: [200], maxW: 99999 } // 保留 maxW
    },
    stackFrame: {
      name: 'Stack',
      layout: { flow: 'COL', gap: [20] }
    },
    heading: {
      name: 'Heading',
      text: { value: 'Component Name' },
      layout: { flow: 'COL', padding: [4, 24] },
      theme: { fontSize: 24, fill: [BLACK, WHITE], radius: 9999 }
    },
    link: {
      name: 'Link',
      text: { value: 'Link' },
      layout: { flow: 'COL', padding: [4, 14] },
      theme: { fontSize: 14, fill: [LIGHT_GRAY, LINK_COLOR], radius: 9999 }
    }
  }

  // [1] 素材を準備
  const layoutFrame: FrameNode = findFrame({ name: FRAME_NAME, parent: target.page, init: !target.selection.length}) || createElement(creation.layoutFrame);
  const stackFrame: FrameNode = createElement(creation.stackFrame);
  const heading: FrameNode = createElement(creation.heading);
  const link: FrameNode = createElement(creation.link);
  target.page.appendChild(layoutFrame);

  // [2] インスタンスを収集
  const instanceCatalog: InstanceCatalog = generateInstanceCatalog(target);
  const orderedMasters: ComponentNode[] = sortComponentsByName([...instanceCatalog.map.keys()]);

  console.log('test', 'start clone');

  // [3] マスターコンポーネント毎に処理
  for (const master of orderedMasters) {
    const dataList: InstanceData[] = instanceCatalog.map.get(master) || [];

    // [3-1] 要素を複製
    const newStackFrame: FrameNode = stackFrame.clone();
    const newHeading: FrameNode = heading.clone();
    setTextProps({ node: newHeading, text: generateMasterName(master) });
    newStackFrame.appendChild(newHeading);

    // [3-2] インスタンスを複製
    dataList
      .sort((a, b) => {
        const comparison = b.text.length - a.text.length;
        if (comparison !== 0) return comparison;
        if (a.text < b.text) return -1;
        if (a.text > b.text) return 1;
        return b.node.width - a.node.width;
      })
      .forEach(instance => {
        const newInstance = instance.node.clone();
        newInstance.layoutPositioning = 'AUTO';
        newStackFrame.appendChild(newInstance);

        const newLink = link.clone();
        setTextProps({ node: newLink, text: instance.location.name, link: instance.node });
        newStackFrame.appendChild(newLink);
      });

    // [3-3] 複製を格納
    layoutFrame.appendChild(newStackFrame);
  }

  // [4] 素材を削除
  stackFrame.remove();
  heading.remove();
  link.remove();

  // [5] 結果に移動
  figma.currentPage = target.page;
  console.log('test', 'Component count:', instanceCatalog.map.size, 'Scoped:', target.selection.length);
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
