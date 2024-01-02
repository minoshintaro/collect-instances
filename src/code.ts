import { TargetNode, MaterialNode, InstanceCatalog, InstanceIndex, InstanceDataList } from "./types";
import { CREATION, PAGE_NAME, FRAME_NAME, FONT_NAME } from "./settings";
import { compareWordOrder, stackInstanceIdByContent } from "./features/callback";
import { createPage, createElement } from "./features/create";
import { findPage, findFrame } from "./features/find";
import { generateInstanceCatalog } from "./features/generateInstanceCatalog";
import { getFirstNode, getMasterComponents } from "./features/get";
import { setToInnerText } from "./features/set";

async function collectInstances() {
  // [1] 宣言
  // [1-1] 処理の対象
  const target: TargetNode = {
    page: findPage(PAGE_NAME) || createPage(PAGE_NAME),
    nodes: [...figma.currentPage.children],
    selection: getMasterComponents([...figma.currentPage.selection])
  }

  // [1-2] 配置先のフレーム
  const container: FrameNode = findFrame({ name: FRAME_NAME, parent: target.page, init: !target.selection.length}) || createElement(CREATION.layoutFrame);
  container.visible = false;

  // [1-3] 複製元のフレーム
  const material: MaterialNode = {
    column: createElement(CREATION.columnFrame),
    row: createElement(CREATION.rowFrame),
    heading: createElement(CREATION.heading),
    subHeading: createElement(CREATION.subHeading),
    link: createElement(CREATION.link)
  }
  for (const prop in material) {
    if (material.hasOwnProperty(prop)) material[prop].visible = false;
  }

  // [2] インスタンスを収集
  const instanceCatalog: InstanceCatalog = generateInstanceCatalog(target);
  console.log('', 'Component:', instanceCatalog.index.size, instanceCatalog);

  // [3] マスター名で呼び出し
  const names: string[] = [...instanceCatalog.index.keys()]
    .sort(compareWordOrder)
    .reverse();

  while (names.length > 0) {
    const masterName: string = names.pop() || '';
    const componentIds: InstanceIndex | undefined = instanceCatalog.index.get(masterName);
    if (!componentIds) continue;

    // [3-1] 配置先、見出し
    const newStackFrame: FrameNode = material.column.clone();
    newStackFrame.name = 'Component';

    const newHeading: FrameNode = material.heading.clone();
    newStackFrame.appendChild(newHeading);
    newHeading.visible = true;
    setToInnerText({ node: newHeading, text: masterName });

    const newRowFrame: FrameNode = material.row.clone();
    newStackFrame.appendChild(newRowFrame);
    newRowFrame.visible = true;

    // [3-2] コンポーネント毎
    for (const componentId of componentIds) {
      const component = figma.getNodeById(componentId) as ComponentNode;
      const instanceDataList: InstanceDataList = instanceCatalog.data.get(componentId) || [];
      if (!instanceDataList.length) continue;

      // [3-2-1] 配置先、小見出し
      const newSubStackFrame: FrameNode = material.column.clone();
      newRowFrame.appendChild(newSubStackFrame);
      newSubStackFrame.visible = true;

      if (component.name !== masterName) {
        const newSubHeading: FrameNode = material.subHeading.clone();
        newSubStackFrame.appendChild(newSubHeading);
        newSubStackFrame.name = 'Variant';
        newSubHeading.visible = true;
        setToInnerText({ node: newSubHeading, text: component.name });
      }

      // [3-2-2] 複製
      instanceDataList
        .reduce(stackInstanceIdByContent, [])
        .map(data => data.ids)
        .flat()
        .forEach(id => {
          const instance = figma.getNodeById(id) as InstanceNode;
          const clone = instance.clone();
          newSubStackFrame.appendChild(clone);
          clone.layoutPositioning = 'AUTO';

          const newLink = material.link.clone();
          newSubStackFrame.appendChild(newLink);
          newLink.visible = true;
          setToInnerText({ node: newLink, text: getFirstNode(instance).name, link: instance });
        });

      // console.log('test', `${masterName} / ${component.name}`);
    }

    // [3-3] 複製を格納
    container.appendChild(newStackFrame);
    newStackFrame.visible = true;
  }

  // [4] 素材を削除
  for (const prop in material) {
    if (material.hasOwnProperty(prop)) material[prop].remove();
  }

  // [5] 結果に移動
  figma.currentPage = target.page;
  figma.viewport.scrollAndZoomIntoView([container]);
  target.page.appendChild(container);
  container.x -= container.width / 2;
  container.y -= container.height / 2;
  container.visible = true;

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
