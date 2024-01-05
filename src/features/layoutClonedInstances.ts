import { MasterNameMap, MaterialNode, ComponentIdMap, ContentMap } from "../types";
import { CREATION } from "../settings";
import { compareWordOrder } from "./callback";
import { createElement } from "./createNode";
import { setLayout } from "./set";

// findExistingFrame(target.page, !target.selection.size) ||

// [1] container →
// └ [2] section ↓
// 　└ h2
// 　└ row →
// 　　└ [3] stack ↓
// 　　　└ h3?
// 　　　└ [4] unit ↓
// 　　　　└ clone
// 　　　　└ link

interface Options {
  page: PageNode;
  frame: FrameNode;
  data: MasterNameMap;
}
export async function layoutClonedInstances(options: Options): Promise<void> {
  const { page, frame, data } = options;

  // [0] 複製元を生成
  const material: MaterialNode = {
    column: createElement(CREATION.column),
    row: createElement(CREATION.row),
    heading: createElement(CREATION.heading),
    subHeading: createElement(CREATION.subHeading),
    link: createElement(CREATION.link)
  }

  // [1] 配置先：コンテナ
  const containerLayout: FrameNode = frame; // hidden

   // コンポーネント名毎に繰返し
  const names: string[] = [...data.keys()].sort(compareWordOrder).reverse();
  for (const name of names) {
    // バリアンツIDごとのデータ
    const componentIdMap: ComponentIdMap | undefined = data.get(name);
    if (!componentIdMap) continue;

    // [2] 配置先：セクション
    const sectionLayout: FrameNode = material.column.clone(); // hidden
    setLayout(sectionLayout, { heading: material.heading.clone(), text: name });
    const sectionInnerLayout: FrameNode = material.row.clone();
    setLayout(sectionInnerLayout, { parent: sectionLayout, visible: true });

    // バリアンツID毎に繰り返し
    for (const componentId of componentIdMap.keys()) {
      const variant: BaseNode | null = figma.getNodeById(componentId);
      if (!variant) continue;
      const contentMap: ContentMap | undefined = componentIdMap.get(componentId);
      if (!contentMap) continue;
      const instanceIds: string[] = [...contentMap.values()].flatMap(value => [...value]);
      if (!instanceIds.length) continue;

      // [3] 配置先：スタック
      const stackLayout: FrameNode = material.column.clone(); // hidden
      if (variant.name !== name) setLayout(stackLayout, { heading: material.heading.clone(), text: variant.name });

      // [4] インスタンスの複製
      instanceIds.forEach(id => {
        const node: BaseNode | null = figma.getNodeById(id);
        if (node && node.type === 'INSTANCE') {
          const unitLayout = material.column.clone();
          const clone = node.clone();
          unitLayout.appendChild(clone);
          stackLayout.appendChild(unitLayout);
          unitLayout.visible = true;
        }
      });

      // [3] 格納
      sectionInnerLayout.appendChild(stackLayout);
      stackLayout.visible = true;
    }

    // [2] 格納
    containerLayout.appendChild(sectionLayout);
    sectionLayout.visible = true;
  }

  // [1] 格納
  page.appendChild(containerLayout);
  containerLayout.visible = true;

  // [0] 削除
  for (const prop in material) {
    if (material.hasOwnProperty(prop)) material[prop].remove();
  }
}


      // instanceDataList
      //   .reduce(stackInstanceIdByContent, [])
      //   .map(data => data.ids)
      //   .flat()
      //   .forEach(id => {
      //     const instance = figma.getNodeById(id) as InstanceNode;
      //     const clone = instance.clone();
      //     stackLayout.appendChild(clone);
      //     clone.layoutPositioning = 'AUTO';
//
      //     const newLink = material.link.clone();
      //     stackLayout.appendChild(newLink);
      //     newLink.visible = true;
      //     setToInnerText({ node: newLink, text: getFirstNode(instance).name, link: instance });
      //   });

      // console.log('test', `${masterName} / ${component.name}`);


