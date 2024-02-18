import { ComponentCatalog } from "../types";
import { ROBOT_R, ROBOT_B, LINK_COLOR, LAYOUT, THEME } from "../settings";
import { createFrame, createText, setFrame, setText } from "./oparateNode";
import { compareWordOrder } from "./utilities";

export function layoutInstanceCatalog(options: { container: FrameNode; data: ComponentCatalog }): void {
  const { container, data } = options;

  // [0] 複製元
  // container → ルート --- lv0
  //   section ↓ --- lv1
  //     heading マスター名
  //     section_row →
  //       section_col ↓ --- lv2
  //         heading バリアント名
  //         unit↓ ---lv3
  //           figure ↓
  //             instance.clone()
  //           caption
  //             unique: layerName { prop: value }
  //           link...
  //         unit... --- lv3

  const newSection = createFrame({ name: 'section', layout: LAYOUT.section });
  const newSectionRow = createFrame({ name: 'row', layout: LAYOUT.sectionRow } );
  const newSectionColumn = createFrame({ name: 'col', layout: LAYOUT.sectionColumn });
  const newUnit = createFrame({ name: 'unit', layout: LAYOUT.unit });
  const newFigure = createFrame({ name: 'figure', minW: 360, layout: LAYOUT.figure, theme: THEME.figure });
  const newHeading = createText({ font: ROBOT_B, size: 32 });
  const newSubHeading = createText({ font: ROBOT_B, size: 20 });
  const newCaption = createText({ font: ROBOT_R, size: 16 });
  const newLink = createText({ font: ROBOT_R, size: 16, color: [LINK_COLOR] });

  // [1] インデックス：コンポーネント名順
  const names: string[] = [...data.index.keys()].sort(compareWordOrder);
  for (const name of names) {
    // コンポーネント名に紐づくID集 Map<ComponentName, KeySet>
    const componentIdSet = data.index.get(name);
    if (!componentIdSet) continue;

    // [lv1] レイアウト＋見出し
    const section = newSection.clone();
    const heading = newHeading.clone();
    setText(heading, { parent: section, content: name, visible: true });
    const sectionRow = newSectionRow.clone();
    setFrame(sectionRow, { parent: section, visible: true });

    // [3] コンポーネント：ID順
    for (const componentId of componentIdSet) {
      // IDに紐づくコンポーネント情報 Map<ComponentId, ComponentData>
      const componentData = data.component.get(componentId);
      if (!componentData) continue;

      // [lv2] レイアウト＋見出し
      const sectionColumn = newSectionColumn.clone();
      setFrame(sectionColumn, { parent: sectionRow, visible: true });
      if (componentData.name !== 'Standard') {
        const subHeading = newSubHeading.clone();
        setText(subHeading, { parent: sectionColumn, content: componentData.name, visible: true });
      }

      // [4] バリアンツ：属性値順
      for (const pattern of componentData.patterns) {
        // 属性と展開情報のペア Map<Prop, VariantData> => [Prop, VariantData]
        const prop = pattern[0];
        const { id, width, height, wrapper, instanceIds } = pattern[1];

        // インスタンスノードの再現
        const node = figma.getNodeById(id);
        if (!node || node.type !== 'INSTANCE') continue;

        // [lv3] レイアウト＋プレビュー
        const unit = newUnit.clone();
        setFrame(unit, { parent: sectionColumn, visible: true });
        const figure = newFigure.clone();
        const image = node.clone();
        setFrame(figure, { parent: unit, children: [image], w: width, h: height + 48, theme: { fills: wrapper.fills }, visible: true });
        if (prop !== '') {
          const caption = newCaption.clone();
          setText(caption, { parent: unit, content: prop, visible: true });
        }

        // リンク
        for (const id of instanceIds) {
          const instanceData = data.instance.get(id);
          if (!instanceData) continue;

          const link = newLink.clone();
          setText(link, { parent: unit, content: instanceData.location, link: id, visible: true });
        }
      }
    }
    //
    setFrame(section, { parent: container, visible: true });
  }
  // [1] クローン元を削除
  [newSection, newSectionRow, newSectionColumn, newUnit, newFigure, newHeading, newSubHeading, newCaption, newLink].forEach(node => node.remove());
}
