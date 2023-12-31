interface Options {
  node: FrameNode,
  text: string,
  link?: SceneNode
}
export function setToInnerText(options: Options): void {
  const { node, text, link } = options;
  const textNode = node.findChild(child => child.type === 'TEXT') as TextNode;
  textNode.characters = link ? `\u{2192} ${text}` : text;
  if (link) textNode.hyperlink = { type: "NODE", value: link.id };
}
