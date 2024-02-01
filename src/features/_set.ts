import { ContainerNode } from "../types";
import { FONT_NAME, BLACK } from "../settings";

interface InnerText {
  name?: string;
  text?: string;
  link?: SceneNode;
  size?: number;
  visible?: boolean;
}
export function setInnerText(input: FrameNode, options: InnerText): void {
  const { name, text, link, size } = options;
  const textNodes = input.findAllWithCriteria({ types: ['TEXT'] });
  const textValue = link ? `${text} \u{2192}` : text;
  if (textNodes) {
    if (name) textNodes[0].name = name;
    if (text) textNodes[0].characters = link ? `${text} \u{2192}` : text;
    if (link) textNodes[0].hyperlink = { type: "NODE", value: link.id };
    if (size) textNodes[0].fontSize = size;
  }
}

interface Option {
  name?: string;
  visible?: boolean;
  parent?: ContainerNode;
}

interface TextOption extends Option {
  content: string;
  link?: string;
  font?: string;
  size?: number;
  color?: ReadonlyArray<Paint>;
}
export function setText(input: TextNode, options: TextOption): void {
  const { name, visible, parent, content, link, size, color } = options;
  if (parent !== undefined) parent.appendChild(input);
  if (content !== undefined) input.characters = link !== undefined ? `${content} \u{2192}` : content;
  if (link !== undefined) input.hyperlink = { type: "NODE", value: link };

  input.fontName = FONT_NAME;
  input.fontSize = size !== undefined ? size : 14;
  input.fills = color !== undefined ? color : BLACK;

  if (name !== undefined) input.name = name;
  if (visible !== undefined) input.visible = visible;
}



interface FrameOption extends Option {

}
export function setFrame(input: FrameNode, options: FrameOption): void {
  const { name, visible, parent } = options;
  if (parent !== undefined) parent.appendChild(input);
  if (name !== undefined) input.name = name;
  if (visible !== undefined) input.visible = visible;
}

