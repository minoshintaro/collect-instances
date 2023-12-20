import { FONT_NAME, BLACK, WHITE } from "../settings";

export function createHeading(input: string): FrameNode {
  const headingBox = figma.createFrame();
  headingBox.name = input;
  headingBox.layoutMode = 'VERTICAL';
  headingBox.counterAxisSizingMode = 'AUTO';
  headingBox.primaryAxisSizingMode = 'AUTO';
  headingBox.paddingTop = 4;
  headingBox.paddingBottom = 4;
  headingBox.paddingLeft = 24;
  headingBox.paddingRight = 24;
  headingBox.cornerRadius = 9999;
  headingBox.fills = BLACK;

  const headingText = figma.createText();
  headingText.fontName = FONT_NAME;
  headingText.fontSize = 24;
  headingText.fills = WHITE;
  headingText.characters = input;

  headingBox.appendChild(headingText);
  return headingBox;
}

