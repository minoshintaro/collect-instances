import { ElementProps, InstanceCatalog, InstanceData } from "./types";
import { PAGE_NAME, FRAME_NAME, FONT_NAME, LINK_COLOR, LIGHT_GRAY, BLACK, WHITE } from "./settings";
import { createClone } from "./features/createClone";
import { createElement } from "./features/createElement";
import { createPage } from "./features/createPage";
import { findFrame } from "./features/findFrame";
import { findPage } from "./features/findPage";
import { generateInstanceCatalog } from "./features/generateInstanceCatalog";
import { generateMasterName } from "./features/generateMasterName";
import { getMasterComponents } from "./features/getMasterComponents";
import { sortComponentsByName } from "./features/sortByName";

async function collectInstances() {
  // [1] 配置先の生成
  const targetPage: PageNode = findPage(PAGE_NAME) || createPage(PAGE_NAME);
  const selectedComponents: ComponentNode[] = getMasterComponents(figma.currentPage.selection);

  const layoutFrameProps: ElementProps = {
    name: FRAME_NAME,
    parent: targetPage,
    layout: { flow: 'WRAP', gap: [200], maxW: 99999 }
  };
  const layoutFrame: FrameNode = findFrame(layoutFrameProps, !selectedComponents.length) || createElement(layoutFrameProps);

  // [2] インスタンスの収集
  const instanceCatalog: InstanceCatalog = generateInstanceCatalog({
    targets: figma.currentPage.children,
    scopes: selectedComponents
  });

  console.log('test', 'Component count:', instanceCatalog.map.size, 'Scoped:', selectedComponents.length);

  // [3] マスターコンポーネント毎に処理
  const orderedMasters: ComponentNode[] = sortComponentsByName([...instanceCatalog.map.keys()]);
  for (const master of orderedMasters) {
    const dataList = instanceCatalog.map.get(master) || null;
    if (!dataList) continue;

    // [3-1] 配置先の生成
    const stackFrame: FrameNode = createElement({
      name: 'Stack',
      parent: layoutFrame,
      layout: { flow: 'COL', gap: [20], minW: 360 }
    });
    const heading: FrameNode = createElement({
      name: 'Heading',
      parent: stackFrame,
      text: { value: generateMasterName(master) },
      layout: { flow: 'COL', padding: [4, 24] },
      theme: { fontSize: 24, fill: [BLACK, WHITE], radius: 9999 }
    });

    // [3-2] インスタンスの複製
    dataList
      .sort((a, b) => {
        // const comparison = b.text.length - a.text.length;
        // if (comparison !== 0) return comparison;
        // if (a.text < b.text) return -1;
        // if (a.text > b.text) return 1;
        return b.node.width - a.node.width;
      })
      .forEach(instance => {
        const cloneNode = createClone({
          node: instance.node,
          parent: stackFrame
        });
        const linkNode = createElement({
          name: 'Link',
          parent: stackFrame,
          text: { value: instance.location.name, link: instance.node },
          layout: { flow: 'COL', padding: [4, 14] },
          theme: { fontSize: 14, fill: [LIGHT_GRAY, LINK_COLOR], radius: 9999 }
        });
      });

    console.log('test', generateMasterName(master));
  }



  // for (const collection of collectionMap) {
  //   const masterComponent: ComponentNode | null = collection[0];
  //   const instances: InstanceData[] = collection[1]
//
  //   // [3-1] 格納先の生成
  //   const masterName: string = masterComponent ? generateMasterName(masterComponent) : 'Unkown';
  //   const stackFrame: FrameNode = createElement({
  //     name: masterName,
  //     parent: layoutFrame,
  //     layout: { flow: 'COL', gap: [20], minW: 360 }
  //   });
  //   const heading: FrameNode = createElement({
  //     name: 'Heading',
  //     parent: stackFrame,
  //     text: { value: masterName },
  //     layout: { flow: 'COL', padding: [4, 24] },
  //     theme: { fontSize: 24, fill: [BLACK, WHITE], radius: 9999 }
  //   });
//
  //   // [3-2] 並び替え、展開
  //   instances
  //     .sort((a, b) => {
  //       if (a.text < b.text) return -1;
  //       if (a.text > b.text) return 1;
  //       return b.node.width - a.node.width;
  //     })
  //     .forEach(instance => {
  //       const cloneNode = createClone({
  //         parent: stackFrame,
  //         node: instance.node
  //       });
  //       const linkNode = createElement({
  //         name: 'Link',
  //         parent: stackFrame,
  //         text: { value: instance.location.name, link: instance.node },
  //         layout: { flow: 'COL', padding: [4, 14] },
  //         theme: { fontSize: 14, fill: [LIGHT_GRAY, LINK_COLOR], radius: 9999 }
  //       });
  //     });
  //   // count = count + instances.length;
  // }
  // console.log('test', count);

  // [4] コンポーネント名で並び替え
  // [...layoutFrame.children]
  //   .sort((a, b) => a.name.localeCompare(b.name))
  //   .forEach(frame => layoutFrame.appendChild(frame));

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
