import { ROBOTO_R, ROBOTO_B, LINK_COLOR, LAYOUT, THEME } from "../settings";
import { Catalog, ComponentIdMap, ComponentIdData, PropData, InstanceData, WrapperIdData, InstanceIdData } from "./generateCatalog";
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
  const newLinkGroup = createFrame({ name: 'links', maxW: 640, layout: LAYOUT.linkGroup });
  const newHeading = createText({ font: ROBOTO_B, size: 32 });
  const newSubHeading = createText({ font: ROBOTO_B, size: 20 });
  const newCaption = createText({ font: ROBOTO_R, size: 16 });
  const newLink = createText({ font: ROBOTO_R, size: 16, color: [LINK_COLOR] });

  /** [1] コンポーネント名 */
  data.index.forEach(componentName => {
    const componentIdMap: ComponentIdMap = data.components.get(componentName) || new Map();

    /** レイアウト＋見出し：lv1 */
    const section = newSection.clone();
    const heading = newHeading.clone();
    setText(heading, { parent: section, content: componentName, visible: true });
    const sectionRow = newSectionRow.clone();
    setFrame(sectionRow, { parent: section, visible: true });

    for (const componentIdData of componentIdMap.values()) {
      const { name, props } = componentIdData;

      /** レイアウト＋見出し：lv2 */
      const sectionColumn = newSectionColumn.clone();
      setFrame(sectionColumn, { parent: sectionRow, visible: true });
      if (name !== '') {
        const subHeading = newSubHeading.clone();
        setText(subHeading, { parent: sectionColumn, content: name, visible: true });
      }

      for (const prop of props) {
        const propData: PropData | undefined = data.entities.get(prop);
        if (!propData) continue;
        const { locationIds, instanceIds, instance } = propData;

        /** ノード */
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

        for (const locationId of locationIds) {
          const wrapperIdData: WrapperIdData | undefined = data.locations.get(locationId);
          if (!wrapperIdData) continue;

          const { name, itemIds } = wrapperIdData;
          const caption = newCaption.clone();
          setText(caption, { parent: unit, content: name, visible: true });
          const linkGroup = newLinkGroup.clone();
          setFrame(linkGroup, { parent: unit, visible: true });

          itemIds.forEach(id => {
            if (instanceIds.has(id)) {
              const link = newLink.clone();
              setText(link, { parent: linkGroup, content: 'link', link: id, visible: true });
            }
          });
        }
      }
    }

    setFrame(section, { parent: container, visible: true });
  });

  // [1] クローン元を削除
  [newSection, newSectionRow, newSectionColumn, newUnit, newFigure, newLinkGroup, newHeading, newSubHeading, newCaption, newLink].forEach(node => node.remove());
}
