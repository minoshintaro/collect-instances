import { FONT_NAME, LINK_COLOR } from "../settings";
import { getRootFrameName } from "./getRootFrameName";

export function createLinkText(node: SceneNode): TextNode {
  const newText = figma.createText();

  newText.fontName = FONT_NAME;
  newText.fontSize = 18;
  newText.fills = LINK_COLOR;
  newText.characters = `\u{2192} ${getRootFrameName(node) || 'NULL'}`;
  newText.hyperlink = {
    type: "NODE",
    value: node.id
  };

  return newText;
}
