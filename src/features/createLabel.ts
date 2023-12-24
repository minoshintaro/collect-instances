import { LabelProps } from "../types";
import { FONT_NAME } from "../settings";

export function createLabel(props: LabelProps): FrameNode {
  const { parent, name, link, theme } = props;

  const labelBox = figma.createFrame();
  labelBox.name = 'Frame';
  labelBox.layoutMode = 'VERTICAL';
  labelBox.counterAxisSizingMode = 'AUTO';
  labelBox.primaryAxisSizingMode = 'AUTO';
  labelBox.paddingTop = theme.py;
  labelBox.paddingBottom = theme.py;
  labelBox.paddingLeft = theme.px;
  labelBox.paddingRight = theme.px;
  labelBox.cornerRadius = 9999;
  labelBox.fills = theme.fill[0];

  const labelText = figma.createText();
  labelText.fontName = FONT_NAME;
  labelText.fontSize = theme.size;
  labelText.fills = theme.fill[1];
  labelText.characters = link ? `\u{2192} ${name}` : name;
  if (link) labelText.hyperlink = { type: "NODE", value: link.id };

  labelBox.appendChild(labelText);

  if (parent) parent.appendChild(labelBox);
  return labelBox;
}
