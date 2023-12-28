import { ElementProps } from "../types";
import { FONT_NAME, BLACK } from "../settings";

function generateFlow(input: string): AutoLayoutMixin['layoutMode'] {
  switch(input) {
    case 'COL':
      return 'VERTICAL';
    case 'ROW':
    case 'WRAP':
      return 'HORIZONTAL';
    default:
      return 'NONE';
  }
}

export function createElement(props: ElementProps): FrameNode {
  const { name, parent, text, layout, theme } = props;

  const newFrame = figma.createFrame();
  newFrame.name = name;
  newFrame.clipsContent = false;
  newFrame.fills = theme && theme.fill ? theme.fill[0] : [];
  newFrame.cornerRadius = theme && theme.radius ? theme.radius : 0;

  if (layout) {
    const { flow, gap, padding, minW, maxW } = layout;

    // newFrame.minWidth = minW || null;
    // newFrame.maxWidth = maxW || null;

    if (flow) {
      newFrame.layoutMode = generateFlow(flow);
      newFrame.layoutWrap = flow === 'WRAP' ? 'WRAP' : 'NO_WRAP';
      if (newFrame.layoutMode !== 'NONE') {
        newFrame.counterAxisSizingMode = 'AUTO';
        newFrame.primaryAxisSizingMode = 'AUTO';
      }
    }
    if (gap) {
      newFrame.itemSpacing = gap[0];
      newFrame.counterAxisSpacing = gap[1] || null;
    }
    if (padding) { // [t: 0, r: 1, b: 2, l: 3][tb: 0,lr: 1][trbl: 0]
      newFrame.paddingTop = padding[0];
      newFrame.paddingRight = padding[1] || padding[0];
      newFrame.paddingBottom = padding[2] || padding[0];
      newFrame.paddingLeft = padding[3] || padding[1] || padding[0];
    }
  }

  if (text) {
    const { value, link } = text;

    const newText = figma.createText();
    newText.fontName = FONT_NAME;
    newText.fontSize = theme && theme.fontSize ? theme.fontSize : 14;
    newText.fills = theme && theme.fill ? theme.fill[1] : BLACK;
    newText.characters = link ? `\u{2192} ${value}` : value;
    if (link) newText.hyperlink = { type: "NODE", value: link.id };

    newFrame.appendChild(newText);
  }

  if (parent) parent.appendChild(newFrame);
  return newFrame;
}
