import { FONT_NAME } from "../settings";
import { setHyperlink } from "./setHyperLink";

export function createLinkText(id: string): TextNode {
  const newText = figma.createText();

  newText.fontName = FONT_NAME;
  newText.fontSize = 18;
  newText.textDecoration = 'UNDERLINE';
  newText.characters = 'LINK';

  setHyperlink(newText, id);
  return newText;
}
