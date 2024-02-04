import { ComponentCatalog } from "../types";
import { ROBOT_R, ROBOT_B, LINK_COLOR, LAYOUT, THEME } from "../settings";
import { createFrame, createText, setFrame, setText } from "./oparateNode";
import { compareWordOrder } from "./utilities";

export function layoutInstanceCatalog(options: { container: FrameNode; data: ComponentCatalog }): void {
  const { container, data } = options;

  // [1] 複製元
  // container → ルート
  //   section ↓
  //     heading マスター名 ※Key
  //     section_row →
  //       section_col ↓
  //         heading バリアント名 ※Key
  //         unit↓
  //           figure ↓
  //             instance.clone()
  //           caption
  //             ・unique: layerName { prop: value }
  //           link...
  //         unit...

  const newSection = createFrame({ name: 'section', layout: LAYOUT.section });
  const newSectionRow = createFrame({ name: 'row', layout: LAYOUT.sectionRow } );
  const newSectionColumn = createFrame({ name: 'col', layout: LAYOUT.sectionColumn });
  const newUnit = createFrame({ name: 'unit', layout: LAYOUT.unit });
  const newFigure = createFrame({ name: 'figure', minW: 360, layout: LAYOUT.figure, theme: THEME.figure });
  const newHeading = createText({ font: ROBOT_B, size: 32 });
  const newSubHeading = createText({ font: ROBOT_B, size: 20 });
  const newCaption = createText({ font: ROBOT_R, size: 16 });
  const newLink = createText({ font: ROBOT_R, size: 16, color: [LINK_COLOR] });

  // [2] コンポーネント名順
  const names: string[] = [...data.index.keys()].sort(compareWordOrder);
  for (const name of names) {
    // 後続タスクのキー
    const componentIdSet = data.index.get(name); // [Name, Set<ComponentId>]
    if (!componentIdSet) continue;

    // レイアウト＋見出し
    const section = newSection.clone();
    const heading = newHeading.clone();
    setText(heading, { parent: section, content: name, visible: true });
    const sectionRow = newSectionRow.clone();
    setFrame(sectionRow, { parent: section, visible: true });

    // [3] コンポーネントID順
    for (const componentId of componentIdSet) {
      // データ
      const componentData = data.component.get(componentId); // [ComponentId, ComponentData]
      if (!componentData) continue;

      const { variant, scenes } = componentData; // variant: string, overridden: [Prop, Set<InstaneId>]

      // レイアウト＋見出し
      const sectionColumn = newSectionColumn.clone();
      setFrame(sectionColumn, { parent: sectionRow, visible: true });
      if (variant !== 'Standard') {
        const subHeading = newSubHeading.clone();
        setText(subHeading, { parent: sectionColumn, content: variant, visible: true });
      }

      // [4] 上書き属性別
      for (const scene of scenes) {
        const prop = scene[0];
        const idSet = scene[1];
        const id = idSet.values().next().value;
        const instanceData = data.instance.get(id);
        if (!instanceData) continue;

        // 配置先
        const unit = newUnit.clone();
        setFrame(unit, { parent: sectionColumn, visible: true });

        // プレビュー
        const instance: BaseNode | null = figma.getNodeById(id);
        if (instance && instance.type === 'INSTANCE') {
          const figure = newFigure.clone();
          const image = instance.clone();
          setFrame(figure, {
            parent: unit,
            children: [image],
            w: instanceData.wrapper.width,
            h: instanceData.height + 48,
            theme: { fills: instanceData.background },
            visible: true
          });

          if (prop !== '') {
            const caption = newCaption.clone();
            setText(caption, { parent: unit, content: prop, visible: true });
          }
        }

        // リンク
        for (const id of idSet) {
          const instanceData = data.instance.get(id);
          if (!instanceData) continue;

          const link = newLink.clone();
          setText(link, { parent: unit, content: instanceData.wrapper.name, link: id, visible: true });
        }
      }
    }
    //
    setFrame(section, { parent: container, visible: true });
  }
  // [1] クローン元を削除
  [newSection, newSectionRow, newSectionColumn, newUnit, newFigure, newHeading, newSubHeading, newCaption, newLink].forEach(node => node.remove());
}
