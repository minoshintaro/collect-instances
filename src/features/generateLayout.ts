// import { MaterialNode } from "../types";
// import { getFirstNode } from "./get";
// import { setToInnerText } from "./set";
//
// interface SectionFrame {
//   name?: string;
//   text: string;
//   link?: SceneNode;
// }
// export function generateSection(input: MaterialNode, options: SectionFrame): FrameNode {
//   const { name, text, link } = options;
//
//   const layout: FrameNode = input.column.clone();
//   if (name) layout.name = name;
//
//   const heading: FrameNode = input.heading.clone();
//   setToInnerText({ node: heading, text, link });
//
//   layout.appendChild(heading);
//   heading.visible = true;
//
//   return layout;
// }
//
// interface InnerFrame {
//   flow: string;
//   parent: FrameNode;
// }
// export function generateInner(input: MaterialNode, options: InnerFrame): FrameNode {
//   const { flow, parent } = options;
//
//   const layout: FrameNode = input[flow].clone();
//
//   parent.appendChild(layout);
//   layout.visible = true;
//
//   return layout;
// }
//
// interface UnitFrame {
//   id: string;
//   parent: FrameNode;
// }
// export async function generateUnit(material: MaterialNode, options: UnitFrame): Promise<FrameNode> {
//   const { id, parent } = options;
//   const node: BaseNode | null = figma.getNodeById(id);
//   const layout = material.column.clone();
//
//   if (node && node.type === 'INSTANCE') {
//     const clone = node.clone();
//     const newLink = material.link.clone();
//     setToInnerText({ node: newLink, text: getFirstNode(node).name, link: node });
//     clone.layoutPositioning = 'AUTO';
//     layout.appendChild(clone);
//     layout.appendChild(newLink);
//     newLink.visible = true;
//   }
//
//   parent.appendChild(layout);
//   return layout;
// }
//
