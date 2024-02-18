interface WrapperData {
  name: string;
  id: string;
}

export function getWrapperData(input: SceneNode): SceneNode | null {
  let current = input;
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
    if ('visible' in parent) current = parent;
  }
  return null;
}
