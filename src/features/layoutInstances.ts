import { ROBOTO_R, ROBOTO_B, LINK_COLOR, LAYOUT, THEME } from "../settings";
import { Catalog, ComponentIdMap, ComponentIdData, PropData, InstanceData, WrapperIdData } from "./generateCatalog";
import { createFrame, createText, setFrame, setText } from "./oparateNode";

/**
 * <container> // lv0
 *   <section> // lv1
 *     <h2>ComponentName</h2>
 *     <section_row>
 *       <section_col> // lv2
 *         <h3>VariantName</h3>
 *         <unit> // lv3
 *           <figure><img src="instance.clone()"></figure>
 *           <p>prop</p> ...
 *           <p>WrapperName: <a href="instance.id">InstanceName</a>, ... </p>
 *         </unit> ...
 */

export function layoutInstances(options: { container: FrameNode; data: Catalog }): void {
  const { container, data } = options;

  /** [0] 複製元 */
  const newSection = createFrame({ name: 'section', layout: LAYOUT.section });
  const newSectionRow = createFrame({ name: 'row', layout: LAYOUT.sectionRow } );
  const newSectionColumn = createFrame({ name: 'col', layout: LAYOUT.sectionColumn });
  const newUnit = createFrame({ name: 'unit', layout: LAYOUT.unit });
  const newFigure = createFrame({ name: 'figure', minW: 360, layout: LAYOUT.figure, theme: THEME.figure });
  const newLinkGroup = createFrame({ name: 'links', maxW: 960, layout: LAYOUT.linkGroup });
  const newHeading = createText({ font: ROBOTO_B, size: 32 });
  const newSubHeading = createText({ font: ROBOTO_B, size: 20 });
  const newCaption = createText({ font: ROBOTO_R, size: 16 });
  const newTitle = createText({ font: ROBOTO_B, size: 16 });
  const newLink = createText({ font: ROBOTO_R, size: 16, color: [LINK_COLOR] });

  /** [1] コンポーネント名 */
  for (const componentName of data.index) {
    const componentIdMap = data.components.get(componentName);
    if (!componentIdMap) continue;

    /** レイアウト＋見出し：lv1 */
    const section = newSection.clone();
    const heading = newHeading.clone();
    setText(heading, { parent: section, content: componentName, visible: true });
    const sectionRow = newSectionRow.clone();
    setFrame(sectionRow, { parent: section, visible: true });

    /** */
    for (const componentIdData of componentIdMap.values()) {
      const { name, props } = componentIdData;

      /** レイアウト＋見出し：lv2 */
      const sectionColumn = newSectionColumn.clone();
      setFrame(sectionColumn, { parent: sectionRow, visible: true });
      if (name !== '') {
        const subHeading = newSubHeading.clone();
        setText(subHeading, { parent: sectionColumn, content: name, visible: true });
      }

      /** */
      for (const propAndData of props) {
        const prop = propAndData[0];
        const { instance, locations } = propAndData[1];

        /** インスタンスノード */
        const node = figma.getNodeById(instance.id);
        if (!node || node.type !== 'INSTANCE') continue;

        /** レイアウト＋プレビュー：lv3 */
        const unit = newUnit.clone();
        setFrame(unit, { parent: sectionColumn, visible: true });
        const figure = newFigure.clone();
        const images = [node.clone()];
        setFrame(figure, { parent: unit, children: images, w: instance.width + 48, h: instance.height + 48, theme: { fills: instance.backgrounds }, visible: true });
        if (prop !== '') {
          const caption = newCaption.clone();
          setText(caption, { parent: unit, content: prop, visible: true });
        }

        /** */
        for (const wrapperIdData of locations.values()) {
          const { name, instances } = wrapperIdData;

          /** */

          const linkGroup = newLinkGroup.clone();
          setFrame(linkGroup, { parent: unit, visible: true });
          const title = newTitle.clone();
          setText(title, { parent: linkGroup, content: name, visible: true });

          /** */
          instances.forEach(instance => {
            const link = newLink.clone();
            setText(link, { parent: linkGroup, content: instance.name, link: instance.id, visible: true });
          });
        }
      }
    }
    setFrame(section, { parent: container, visible: true });
  }

  // [1] クローン元を削除
  [newSection, newSectionRow, newSectionColumn, newUnit, newFigure, newLinkGroup, newHeading, newSubHeading, newCaption, newTitle, newLink].forEach(node => node.remove());
}
