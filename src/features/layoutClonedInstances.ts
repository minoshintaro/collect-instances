import { MasterNameMap, MaterialNode } from "../types";
import { CREATION } from "../settings";
import { compareWordOrder } from "./utilities";
import { createElement } from "./createNode";
import { setInnerText } from "./set";

// ■データ
// MasterNameMap = ['Button', ['ID', ...]]
// ComponentIdMap = ['ID', ['Lorem ipsum', ...]]
// ContentMap = ['Lorem ipsum', ['id', ...]]
// InstanceIdMap = ['id', { prop: value }]
//
// ■レイアウト
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
  let material: MaterialNode | null = {
    column: createElement(CREATION.column),
    row: createElement(CREATION.row),
    heading: createElement(CREATION.heading),
    link: createElement(CREATION.link)
  }

  const newSection = material.column.clone();
  const newSectionHeading = material.heading.clone();
  newSection.appendChild(newSectionHeading);
  newSectionHeading.visible = true;
  material.section = newSection;

  const newStack = material.column.clone();
  const newSubHeading = material.heading.clone();
  newStack.appendChild(newSubHeading);
  newSubHeading.visible = true;
  material.stack = newStack;

  // [1] データからキーを取得し、反復処理
  const nameKeys: string[] = [...data.keys()].sort(compareWordOrder).reverse();
  for (const name of nameKeys) {
    // データ取得 ['Button', [ ['ID', V], ['ID', V], ... ]], ...
    const componentMap = data.get(name);
    if (!componentMap) continue;

    // 複製処理：セクション＋H2
    const section: FrameNode = material.section.clone();
    const sectionInner = material.row.clone();
    setInnerText(section, { text: name });
    section.appendChild(sectionInner);
    sectionInner.visible = true;

    // [2] データからキーを取得し、反復処理
    for (const id of componentMap.keys()) {
      // データ取得 ['ID', [ ['Lorem', V], ['Lorem', V], ... ]], ...
      const contentMap = componentMap.get(id);
      if (!contentMap) continue;

      // ノード取得
      const component: BaseNode | null = figma.getNodeById(id);
      if (!component) continue;

      // 複製処理：サブセクション＋H3
      const stack: FrameNode = material.stack.clone();
      setInnerText(stack, { text: component.name, size: 16 });

      // [3] データからキーを取得し、反復処理
      for (const content of contentMap.keys()) {
        // データ取得 ['Lorem', [ ['ID', V], ['ID', V], ... ]], ...
        const instanceMap = contentMap.get(content);
        if (!instanceMap) continue;

        // [4] データからキーを取得し、反復処理
        for (const id of instanceMap.keys()) {
          // データ取得 ['ID', [ { prop: V }, { prop: V }, ... ]], ...
          const instanceProps = instanceMap.get(id);
          if (!instanceProps) continue;

          // ノード取得
          const instance: BaseNode | null = figma.getNodeById(id);
          if (!instance || instance.type !== 'INSTANCE') continue;

          // 複製処理
          const unit = material.column.clone();
          const clone = instance.clone();
          const link = material.link.clone();
          setInnerText(link, { text: instanceProps.location, link: instance });
          unit.appendChild(clone);
          unit.appendChild(link);

          // 親に格納
          stack.appendChild(unit);
          link.visible = true;
          unit.visible = true;
        }
      }
      // 親に格納
      sectionInner.appendChild(stack);
      stack.visible = true;
    }
    // 親に格納
    frame.appendChild(section);
    section.visible = true;
  }
  // ページに格納
  page.appendChild(frame);
  frame.visible = true;

  // 不要なノードを削除
  for (const prop in material) {
    if (material[prop] && typeof material[prop].remove === 'function') material[prop].remove();
  }
}
