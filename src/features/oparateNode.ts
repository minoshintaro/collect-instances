import { BaseProp, SizeProp, FrameProp, TextProp } from "../types";
import { LAYOUT_MODE, ROBOT_R, BLACK } from "../settings";

function setNode(input: SceneNode, props: BaseProp): void {
  const { parent, name, visible } = props;
  if (parent !== undefined) parent.appendChild(input);
  if (name !== undefined) input.name = name;
  if (visible !== undefined) input.visible = visible;
}

function setSize(input: FrameNode | TextNode, props: SizeProp): void {
  const { w, h, minW, maxW } = props;
  if (w !== undefined && h !== undefined) input.resize(w, h);
  if (minW !== undefined) input.minWidth = minW;
  if (maxW !== undefined) input.maxWidth = maxW;
}

export function setFrame(input: FrameNode, props: FrameProp): void {
  const { children, layout, theme } = props;

  if (children !== undefined) {
    children.forEach(item => input.appendChild(item));
  }

  if (layout !== undefined) {
    const { flow, align, gap, padding } = layout;

    if (flow !== undefined) {
      input.layoutMode = LAYOUT_MODE[flow];
      input.layoutWrap = flow === 'WRAP' ? 'WRAP' : 'NO_WRAP';
    }
    if (input.layoutMode !== 'NONE') {
      input.counterAxisSizingMode = 'AUTO';
      input.primaryAxisSizingMode = 'AUTO';
    }
    if (align !== undefined && input.layoutMode === 'VERTICAL') {
      input.counterAxisAlignItems = "CENTER";
    }
    if (gap !== undefined) {
      input.itemSpacing = gap[0];
      input.counterAxisSpacing = gap[1] || null;
    }
    if (padding !== undefined) {
      switch (padding.length) {
        case 4: {
          input.paddingTop = padding[0];
          input.paddingRight = padding[1];
          input.paddingBottom = padding[2];
          input.paddingLeft = padding[3];
          break;
        }
        case 2: {
          input.paddingTop = padding[0];
          input.paddingRight = padding[1];
          input.paddingBottom = padding[0];
          input.paddingLeft = padding[1];
          break;
        }
        default: {
          input.paddingTop = padding[0];
          input.paddingRight = padding[0];
          input.paddingBottom = padding[0];
          input.paddingLeft = padding[0];
          break;
        }
      }
    }
  }

  if (theme !== undefined) {
    const { radius, fills, effect } = theme;
    if (radius !== undefined) input.cornerRadius = radius;
    if (fills !== undefined) input.fills = fills;
    if (effect !== undefined) input.effects = [effect];
  }

  setSize(input, props);
  setNode(input, props);
}

export function setText(input: TextNode, props: TextProp): void {
  const { content, link, font, size, color } = props;
  if (content !== undefined) input.characters = link !== undefined ? `${content} \u{2192}` : content;
  if (link !== undefined) input.hyperlink = { type: "NODE", value: link };
  if (font !== undefined) input.fontName = font;
  if (size !== undefined) input.fontSize = size;
  if (color !== undefined) input.fills = color;

  setSize(input, props);
  setNode(input, props);
}

export function createFrame(props: FrameProp): FrameNode {
  const node = figma.createFrame();
  node.fills = [];
  node.clipsContent = false;
  node.visible = false;
  setFrame(node, props);
  return node;
}

export function createText(props: TextProp): TextNode {
  const node = figma.createText();
  node.fontName = ROBOT_R;
  node.fontSize = 14;
  node.fills = [BLACK];
  node.visible = false;
  setText(node, props);
  return node;
}

export function createPage(name: string): PageNode {
  const node = figma.createPage();
  node.name = name;
  return node;
}

export function findPage(input: string): PageNode | null {
  return figma.root.findChild(child => child.name === input);
}
