import { LayoutFramePorps } from "../tyes";

export function createAutoLayoutFrame(props: LayoutFramePorps): FrameNode {
  const { target, name, flow, wrap, gap } = props;
  const newFrame = figma.createFrame();

  newFrame.name = name;
  newFrame.layoutMode = flow;
  newFrame.layoutWrap = wrap;
  newFrame.counterAxisSizingMode = 'AUTO';
  newFrame.primaryAxisSizingMode = 'AUTO';
  newFrame.itemSpacing = gap;
  newFrame.minWidth = 360;
  newFrame.maxWidth = 99999;
  newFrame.fills = [];
  newFrame.clipsContent = false;

  target.appendChild(newFrame);
  return newFrame;
}
