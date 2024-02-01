import { ComponentMap, ContainerNode } from "../types";
import { ROBOT_R, ROBOT_B, LINK_COLOR, LAYOUT, THEME } from "../settings";
import { createFrame, createText, setFrame, setText } from "./oparateNode";
import { compareWordOrder } from "./utilities";

export function layoutInstanceCatalog(options: { container: FrameNode; data: ComponentMap }): void {
  const { container, data } = options;

  // [1]
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
  const newFigure = createFrame({ name: 'figure', layout: LAYOUT.figure, theme: THEME.figure });
  const newHeading = createText({ font: ROBOT_B, size: 32 });
  const newCaption = createText({ font: ROBOT_R, size: 16 });
  const newLink = createText({ font: ROBOT_R, size: 16, color: [LINK_COLOR] });

  // [2] マスター名順でデータを呼び出す
  // Lv1: ComponentMap<'Master Name', VariantMap>
  // Lv2: VariantMap<'ID', IntanceMap>
  // Lv3: InstanceMap<'Content', InstancePropMap>
  // Lv4: InstancePropMap<'Overridden', InstanceDataList>
  // Lv5: InstanceDataSet<{ K: V }>

  const nameKeys: string[] = [...data.keys()].sort(compareWordOrder).reverse();
  for (const masterName of nameKeys) {

    // Lv2のデータを取り出す
    const variantMap = data.get(masterName); // VariantMap<'ID', IntanceMap>
    if (!variantMap) continue;

    // マスター名の見出しを立てる
    const section = newSection.clone();
    const heading = newHeading.clone();
    setText(heading, { parent: section, content: masterName, visible: true });
    const sectionRow = newSectionRow.clone();
    setFrame(sectionRow, { parent: section, visible: true });

    // [3] VariantMap<'ID', IntanceMap> からキーを取得
    for (const id of variantMap.keys()) {
      // ・idからコンポーネントノードを再現し、情報を取得する
      const variant: BaseNode | null = figma.getNodeById(id);
      if (!variant) continue;

      // ・Lv3のデータを取り出す
      const instanceMap = variantMap.get(id); // InstanceMap<'Content', InstancePropMap>
      if (!instanceMap) continue;

      // ・バリアントがあれば見出しを立てる
      const sectionColumn = newSectionColumn.clone();
      setFrame(sectionColumn, { parent: sectionRow, visible: true });
      if (variant.name !== masterName) {
        const subHeading = newHeading.clone();
        setText(subHeading, { parent: sectionColumn, content: variant.name, size: 18, visible: true });
      }

      // [4] InstanceMap<'Content', InstancePropMap> からキーを取得し、InstancePropMapを順に呼ぶ
      for (const content of instanceMap.keys()) {
        // ・Lv4のデータを取り出す

        const instancePropMap = instanceMap.get(content); // InstancePropMap<'Overridden', InstanceDataList>
        if (!instancePropMap) continue;

        // [5] InstancePropMap<'Overridden', InstanceDataSet> からバリューを取り出す
        for (const overridden of instancePropMap.keys()) {
          //
          const instanceDataList = instancePropMap.get(overridden);
          if (!instanceDataList) continue;

          //
          const unit = newUnit.clone();

          instanceDataList.forEach((data, index) => {
            // プレビューの作成
            if (index === 0) {
              const instance: BaseNode | null = figma.getNodeById(data.id);
              if (instance && instance.type === 'INSTANCE') {
                const image = instance.clone();
                const figure = newFigure.clone()
                setFrame(figure, { parent: unit, children: [image], visible: true, layout: { w: data.location.width, h: data.height + 48 }, theme: { fills: data.background } });
                if (overridden !== '') {
                  const caption = newCaption.clone();
                  setText(caption, { parent: unit, content: overridden, visible: true });
                }
              }
            }
            // リンクの作成
            const link = newLink.clone();
            setText(link, { parent: unit, content: data.location.name, link: data.id, visible: true });
          });

          //
          setFrame(unit, { parent: sectionColumn, visible: true });
        }
      }
    }

    //
    setFrame(section, { parent: container, visible: true });
  }

  // [1] クローン元を削除
  [newSection, newSectionRow, newSectionColumn, newUnit, newFigure, newHeading, newCaption, newLink].forEach(node => node.remove());
}
