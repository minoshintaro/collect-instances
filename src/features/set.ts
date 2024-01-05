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

interface LayoutOptions {
  heading?: FrameNode;
  text?: string;
  parent?: FrameNode;
  visible?: boolean;
}
export function setLayout(input: FrameNode, options: LayoutOptions): void {
  const { heading, text, parent, visible } = options;
  if (heading && text) {
    input.appendChild(heading);
    heading.visible = true;
    setToInnerText({ node: heading, text });
  }

  if (visible) input.visible = true;
  if (parent) parent.appendChild(input);
}
