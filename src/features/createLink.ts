import { FONT_NAME, LINK_COLOR, LIGHT_GRAY } from "../settings";
import { getFirstNode } from "./getFirstNode";

export function createLink(node: SceneNode): FrameNode {
  const linkBox = figma.createFrame();
  linkBox.name = 'Link';
  linkBox.layoutMode = 'VERTICAL';
  linkBox.counterAxisSizingMode = 'AUTO';
  linkBox.primaryAxisSizingMode = 'AUTO';
  linkBox.paddingTop = 4;
  linkBox.paddingBottom = 4;
  linkBox.paddingLeft = 12;
  linkBox.paddingRight = 12;
  linkBox.cornerRadius = 9999;
  linkBox.fills = LIGHT_GRAY;

  const linkText = figma.createText();
  linkText.fontName = FONT_NAME;
  linkText.fontSize = 14;
  linkText.fills = LINK_COLOR;
  linkText.characters = `\u{2192} ${getFirstNode(node).name || 'NULL'}`;
  linkText.hyperlink = { type: "NODE", value: node.id };

  linkBox.appendChild(linkText);
  return linkBox;
}
