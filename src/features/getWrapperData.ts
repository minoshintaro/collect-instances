import { isFilled } from "./utilities";

export interface WrapperData {
  name: string;
  id: string;
  wrapped: boolean;
  fills?: MinimalFillsMixin['fills'];
}

export function getWrapperData(input: InstanceNode): WrapperData {
  let result: WrapperData = {
    name: input.name,
    id: input.id,
    wrapped: false
  };

  let current: PageNode | SceneNode = input;
  while (current.parent) {
    /**
     * 子ノードを持つのは (BooleanOperation), Component, ComponentSet, Frame, Group, Instance, Page, Section
     * [1] 親が ComponentSet | Component | Instance => 入れ子インスタンスなので中断
     * [2] 親が Group | Frame => 継続
     * [3] 親が Page | Section => 終点
     */
    if (current.parent.type === 'FRAME') {
      if (result.fills === undefined && isFilled(current.parent.fills)) result.fills = current.parent.fills;
      current = current.parent;
      continue; // 継続
    } else if (current.parent.type === 'GROUP') {
      if (current.type === 'FRAME') {
        result.id = current.id;
        result.name = current.name;
      }
      current = current.parent;
      continue; // 継続
    } else if (current.parent.type === 'SECTION') {
      if (result.fills === undefined && isFilled(current.parent.fills)) result.fills = current.parent.fills;
      if (current.type === 'FRAME') {
        result.id = current.id;
        result.name = current.name;
      }
      break; // 終点
    } else if (current.parent.type === 'PAGE') {

      if (current.type === 'FRAME') {
        result.id = current.id;
        result.name = current.name;
      }
      result.wrapped = true;
      break; // 終点
    } else {
      break; // 中断
    }
  }
  if (result.fills === undefined) result.fills = figma.currentPage.backgrounds;

  return result;
}
