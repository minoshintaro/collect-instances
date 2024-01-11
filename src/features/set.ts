interface InnerText {
  name?: string;
  text?: string;
  link?: SceneNode;
  size?: number;
  visible?: boolean;
}
export function setInnerText(target: FrameNode, options: InnerText): void {
  const { name, text, link, size } = options;
  const textNodes = target.findAllWithCriteria({ types: ['TEXT'] });
  const textValue = link ? `${text} \u{2192}` : text;
  if (textNodes) {
    if (name) textNodes[0].name = name;
    if (text) textNodes[0].characters = link ? `${text} \u{2192}` : text;
    if (link) textNodes[0].hyperlink = { type: "NODE", value: link.id };
    if (size) textNodes[0].fontSize = size;
  }
}
