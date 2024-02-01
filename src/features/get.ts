export function getTime(start: Date, end: Date): string {
  return `${end.getTime() - start.getTime()}ms`;
}

export function getWrapperNode(node: SceneNode): SceneNode | null {
  let current = node;
  while (current.parent) {
    const { parent } = current;
    switch (parent.type) {
      case 'INSTANCE':
      case 'COMPONENT':
      case 'COMPONENT_SET':
        return null; // => 自身がネストされたインスタンスなら偽、空を返す
      case 'FRAME':
      case 'GROUP':
        if (!parent.visible) return null; // => 親コンテナが非表示なら偽、空を返す
        break; // 次ターンに進む
      case 'SECTION':
        if (!parent.visible) return null; // => 親コンテナが非表示なら偽、空を返す
        return current; // => 親がセクションなら真、自身を返す
      case 'PAGE':
        return current; // 親がページなら真、自身を返す
      default: break;
    }
    if ('clone' in parent) current = parent;
  }
  return null;
}

export function getBackground(node: SceneNode): readonly Paint[] | null {
  let current = node;
  while (current.parent) {
    const { parent } = current;
    switch (parent.type) {
      case 'FRAME':
      case 'SECTION':
        if (Array.isArray(parent.fills) && parent.fills.length > 0) return parent.fills; // ReadonlyArray<Paint> | figma.mixed
        break;
      case 'PAGE':
        return parent.backgrounds; // backgrounds: ReadonlyArray<Paint>
      default: break;
    }
    if ('clone' in parent) current = parent;
  }
  return null;
}

export function getMasterName(node: ComponentNode): BaseNodeMixin['name'] {
  return node.parent && node.parent.type === 'COMPONENT_SET' ? node.parent.name : node.name;
}

export function getInnerText(input: InstanceNode): string {
  const nodes = input.findAllWithCriteria({ types: ['TEXT'] });
  const sortedNodes = nodes.sort((a, b) => a.y === b.y ? a.x - b.x : a.y - b.y);

  let result = '';
  sortedNodes.forEach(node => result += node.characters + ' ');

  return result.trim();
}
