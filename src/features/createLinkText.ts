import { FONT_NAME, LINK_COLOR } from "../settings";
import { getRootFrameName } from "./getRootFrameName";
import { setHyperlink } from "./setHyperLink";

export function createLinkText(node: SceneNode): TextNode {
  const newText = figma.createText();

  newText.fontName = FONT_NAME;
  newText.fontSize = 18;
  // newText.textDecoration = 'UNDERLINE';
  newText.fills = LINK_COLOR;
  newText.characters = `\u{2192} ${getRootFrameName(node) || 'NULL'}`;

  setHyperlink(newText, node.id);
  return newText;
}
