import { NodeGroup } from "../types";

export function getNodesOnPage(page: PageNode): NodeGroup {
  return {
    instance: page.findAllWithCriteria({ types: ['INSTANCE'] }),
    selection: [...page.selection]
  }
}

export function getWrapperNode(node: SceneNode): SceneNode | null {
  let current = node;
  while (current.parent) {
    const { parent } = current;
    switch (parent.type) {
      case 'INSTANCE':
      case 'COMPONENT':
      case 'COMPONENT_SET':
        return null; // 自身がネストされたインスタンスなら偽
      case 'FRAME':
      case 'GROUP':
        if (!parent.visible) return null; // 親コンテナが非表示なら偽
        break; // 次ターンに進む
      case 'SECTION':
        if (!parent.visible) return null; // 親コンテナが非表示なら偽
        return current; // 親がセクションなら自身を返す
      case 'PAGE':
        // if (parent.name !== figma.currentPage.name) return false;
        return current; // 親がセクションなら自身を返す
      default: break;
    }
    if ('clone' in parent) current = parent;
  }
  return null;
}

export function getMasterName(node: ComponentNode): string {
  return node.parent && node.parent.type === 'COMPONENT_SET' ? node.parent.name : node.name;
}

export function getInnerText(input: InstanceNode): string {
  let text = '';
  input
    .findAllWithCriteria({ types: ['TEXT'] })
    .forEach(node => text += node.characters + ' ');
  return text.trim();
}

export function getTime(start: Date, end: Date): string {
  return `${end.getTime() - start.getTime()}ms`
}
