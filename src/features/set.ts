interface Options {
  node: FrameNode,
  text: string,
  link?: SceneNode
}
export function setToInnerText(options: Options): void {
  const { node, text, link } = options;
  const textNode = node.findChild(child => child.type === 'TEXT') as TextNode;
  if (link) {
    textNode.characters = `${text} \u{2192}`;
    textNode.hyperlink = { type: "NODE", value: link.id };
  } else {
    textNode.characters = text;
  }
}
