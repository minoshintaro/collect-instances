import { ComponentMap, VariantMap, InstanceMap, InstancePropMap, MaterialNode } from "../types";
import { CREATION } from "../settings";
import { compareWordOrder } from "./utilities";
import { createElement } from "./_createNode";
import { setInnerText, setFrame, setText } from "./_set";

// container → ルート
//   section ↓
//     heading マスター名 ※Key
//     row →
//       col ↓
//         heading バリアント名 ※Key
//         unit↓
//           figure ↓
//             instance.clone()
//           caption
//             ・unique: layerName { prop: value }
//           link...
//         unit...

interface Option {
  page: PageNode;
  frame: FrameNode;
  data: ComponentMap;
}
export async function layoutClonedInstances(options: Option): Promise<void> {
  const { page, frame, data } = options;

  // [0] 複製元を生成
  let material: MaterialNode | null = {
    column: createElement(CREATION.column),
    row: createElement(CREATION.row),
    heading: createElement(CREATION.heading),
    link: createElement(CREATION.link)
  }

  // 複製処理：
  const newSection = material.column.clone();
  const newHeading = material.heading.clone();
  const newRow = material.row.clone();
  const newColumn = material.column.clone();
  const newSubHeading = material.heading.clone();

  newSection.appendChild(newHeading);
  newHeading.visible = true;
  newSection.appendChild(newRow);
  newRow.visible = true;
  material.section = newSection;

  newColumn.appendChild(newSubHeading);
  newSubHeading.visible = true;
  material.stack = newColumn;

  // [1] ComponentMap<'Master Name', VariantMap> からキーを取得し、反復処理
  const nameKeys: string[] = [...data.keys()].sort(compareWordOrder).reverse();
  for (const name of nameKeys) {
    // データ：ComponentMap => VariantMap<'ID', IntanceMap>
    const variantMap = data.get(name);
    if (!variantMap) continue;

    // 複製処理：セクション＋H2
    const section: FrameNode = material.section.clone();
    setInnerText(section, { text: name });

    // [2] VariantMap<'ID', IntanceMap> からキーを取得し、反復処理
    for (const id of variantMap.keys()) {
      // データ：VariantMap => InstanceMap<'Content', InstancePropMap>
      const instanceMap = variantMap.get(id);
      if (!instanceMap) continue;

      // ノード取得
      const variant: BaseNode | null = figma.getNodeById(id);
      if (!variant) continue;

      // 複製処理：サブセクション＋H3
      const stack: FrameNode = material.stack.clone();
      setInnerText(stack, { text: variant.name, size: 16 });

      // [3] InstanceMap<'Content', InstancePropMap> からキーを取得し、反復処理
      for (const content of instanceMap.keys()) {
        // InstanceMap => InstancePropMap<{ prop: V }>
        const instancePropSet = instanceMap.get(content);
        if (!instancePropSet) continue;

        // [4] InstancePropMap<{ prop: V }> からキーを取得し、反復処理
        let override = null;
        for (const prop of instancePropSet) {

          // ノード取得
          const instance: BaseNode | null = figma.getNodeById(prop.id);
          if (!instance || instance.type !== 'INSTANCE') continue;

          // 前回比較
          const thisOverride = prop.overrides.join(' ');

          // 複製処理
          if (override !== thisOverride) {
            const unit = material.column.clone();
            const clone = instance.clone();
            const link = material.link.clone();
            setInnerText(link, { text: `${prop.overrides.join(' ')} \n ${prop.wrapper.name}`, link: instance });
            unit.appendChild(clone);
            unit.appendChild(link);

            // 親に格納
            stack.appendChild(unit);
            link.visible = true;
            unit.visible = true;
          } else {
            const unit = material.column.clone();
            const link = material.link.clone();
            setInnerText(link, { text: `${prop.wrapper.name}`, link: instance });
            unit.appendChild(link);

            // 親に格納
            stack.appendChild(unit);
            link.visible = true;
            unit.visible = true;
          }

          override = thisOverride;
        }
      }
      // 親に格納
      const row = section.findChild(node => node.name === 'ROW');
      if (row && row.type === 'FRAME') row.appendChild(stack);
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
