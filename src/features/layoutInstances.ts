import { NAME, ROBOT_R, ROBOT_B, LINK_COLOR, LAYOUT, THEME } from "../settings";
import { Catalog, ComponentNameData, ComponentIdData, PropData, ExampleData, LocationData } from "./generateCatalog";
import { createFrame, createText, setFrame, setText } from "./oparateNode";

export function layoutInstances(options: { container: FrameNode; data: Catalog }): void {
  const { container, data } = options;

  /**
   * <container> // lv0
   *   <section> // lv1
   *     <h2>ComponentName</h2>
   *     <section_row>
   *       <section_col> // lv2
   *         <h3>VariantName</h3>
   *         <stack> // lv3
   *           <figure><img src="instance.clone()"></figure>
   *           <p>prop</p> ...
   *           <p>WrapperName: <a href="instance.id">InstanceName</a>, ... </p>
   *         </stack> ...
   */
  const newSection = createFrame({ name: 'section', layout: LAYOUT.section });
  const newSectionRow = createFrame({ name: 'row', layout: LAYOUT.sectionRow } );
  const newSectionColumn = createFrame({ name: 'col', layout: LAYOUT.sectionColumn });
  const newStack = createFrame({ name: 'unit', layout: LAYOUT.unit });
  const newFigure = createFrame({ name: 'figure', minW: 360, layout: LAYOUT.figure, theme: THEME.figure });
  const newHeading = createText({ font: ROBOT_B, size: 32 });
  const newSubHeading = createText({ font: ROBOT_B, size: 20 });
  const newCaption = createText({ font: ROBOT_R, size: 16 });
  const newLink = createText({ font: ROBOT_R, size: 16, color: [LINK_COLOR] });

  /** [1] コンポーネント名 */
  for (const componentName of data.index) {
    const componentNameData: ComponentNameData | undefined = data.componentNames.get(componentName);
    if (!componentNameData) continue;

    /** レイアウト＋見出し：lv1 */
    const section = newSection.clone();
    const heading = newHeading.clone();
    setText(heading, { parent: section, content: componentName, visible: true });
    const sectionRow = newSectionRow.clone();
    setFrame(sectionRow, { parent: section, visible: true });

    /** [2] コンポーネントID */
    for (const componentId of componentNameData.componentIds) {
      const componentIdData: ComponentIdData | undefined = data.components.get(componentId);
      if (!componentIdData) continue;

      /** レイアウト＋見出し：lv2 */
      const sectionColumn = newSectionColumn.clone();
      setFrame(sectionColumn, { parent: sectionRow, visible: true });
      if (componentIdData.name !== NAME.variant.standard) {
        const subHeading = newSubHeading.clone();
        setText(subHeading, { parent: sectionColumn, content: componentIdData.name, visible: true });
      }

      /** [3] バリアント名・デザインスペック */
      for (const prop of componentIdData.props) {
        const propData: PropData | undefined = data.usages.get(prop);
        if (!propData) continue;

        const exampleData: ExampleData | undefined = data.example.get(propData.exampleId);
        if (!exampleData) continue;

        const instance = figma.getNodeById(propData.exampleId);
        if (!instance || instance.type !== 'INSTANCE') continue;

        /** レイアウト＋プレビュー：lv3 */
        const stack = newStack.clone();
        setFrame(stack, { parent: sectionColumn, visible: true });
        const figure = newFigure.clone();
        const images = [instance.clone()];
        setFrame(figure, { parent: stack, children: images, w: exampleData.width, h: exampleData.height + 48, theme: { fills: exampleData.fills }, visible: true });
        // if (prop !== '') {
        //   const caption = newCaption.clone();
        //   setText(caption, { parent: stack, content: prop, visible: true });
        // }

        // リンク
        for (const locationId of propData.locationIds) {
          const locationData: LocationData | undefined = data.links.get(locationId);
          if (!locationData) continue;

          const caption = newCaption.clone();
          setText(caption, { parent: stack, content: locationData.name, visible: true });

          locationData.instances.forEach(item => {
            const link = newLink.clone();
            setText(link, { parent: stack, content: item.name, link: item.id, visible: true });
          });
        }
      }
    }
    //
    setFrame(section, { parent: container, visible: true });
  }
  // [1] クローン元を削除
  [newSection, newSectionRow, newSectionColumn, newStack, newFigure, newHeading, newSubHeading, newCaption, newLink].forEach(node => node.remove());
}
