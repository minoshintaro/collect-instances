import { LayoutFramePorps } from "../types";

export function createAutoLayoutFrame(props: LayoutFramePorps): FrameNode {
  const { parent, name, flow, wrap, gap } = props;
  const newFrame = figma.createFrame();

  newFrame.name = name;
  newFrame.layoutMode = flow;
  newFrame.layoutWrap = wrap;
  newFrame.itemSpacing = gap;
  newFrame.counterAxisSizingMode = 'AUTO';
  newFrame.primaryAxisSizingMode = 'AUTO';
  newFrame.minWidth = 360;
  newFrame.maxWidth = 99999;
  newFrame.fills = [];
  newFrame.clipsContent = false;

  parent.appendChild(newFrame);
  return newFrame;
}
