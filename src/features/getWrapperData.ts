import { isFilled } from "./utilities";

export interface WrapperData {
  standalone: boolean;
  id: string;
  name: string;
  fills: MinimalFillsMixin['fills'];
}

export function getWrapperData(input: InstanceNode): WrapperData {
  const result: WrapperData = {
    standalone: false,
    id: input.id,
    name: input.name,
    fills: []
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
      if (!result.fills && isFilled(current.parent.fills)) result.fills = current.parent.fills;
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
      if (!result.fills && isFilled(current.parent.fills)) result.fills = current.parent.fills;
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
      result.standalone = true;
      break; // 終点
    } else {
      break; // 中断
    }
  }

  return result;
}
