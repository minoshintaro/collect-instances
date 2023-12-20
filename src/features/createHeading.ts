import { FONT_NAME } from "../settings";
import { getRootFrameName } from "./getRootFrameName";

export function createHeading(node: SceneNode): TextNode {
  const newText = figma.createText();

  newText.fontName = FONT_NAME;
  newText.fontSize = 24;
  // newText.textDecoration = 'UNDERLINE';
  // newText.fills = [LINK_COLOR];
  newText.characters = `${getRootFrameName(node) || 'NULL'}`;


  return newText;
}
