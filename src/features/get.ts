import { NAME } from "../settings";

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
    if ('visible' in parent) current = parent;
  }
  return null;
}

export function getComponentFullName(node: ComponentNode): string[] {
  return node.parent && node.parent.type === 'COMPONENT_SET' ? [node.parent.name, node.name] : [node.name, NAME.variant.standard];
}

export function getBackground(node: SceneNode): MinimalFillsMixin['fills'] {
  let current = node;
  while (current.parent) {
    const { parent } = current;
    switch (parent.type) {
      case 'FRAME':
      case 'SECTION':
        if (Array.isArray(parent.fills) && parent.fills.length > 0) return parent.fills; // fills: ReadonlyArray<Paint> | figma.mixed
        break;
      case 'PAGE':
        return parent.backgrounds;
      default: break;
    }
    if ('visible' in parent) current = parent;
  }
  return figma.currentPage.backgrounds;
}

export function getNodeValue(node: SceneNode, prop: NodeChangeProperty): string {
  const checkedValue = (function() {
    switch (node.type) {
      case 'BOOLEAN_OPERATION': return node[prop as keyof BooleanOperationNode];
      case 'ELLIPSE': return node[prop as keyof EllipseNode];
      case 'FRAME': return node[prop as keyof FrameNode];
      case 'GROUP': return node[prop as keyof GroupNode];
      case 'INSTANCE': return node[prop as keyof InstanceNode];
      case 'LINE': return node[prop as keyof LineNode];
      case 'POLYGON': return node[prop as keyof PolygonNode];
      case 'RECTANGLE': return node[prop as keyof RectangleNode];
      case 'TEXT': return node[prop as keyof TextNode];
      case 'VECTOR': return node[prop as keyof VectorNode];
      default: return 'STRANGER';
    }
  })();
  return JSON.stringify(checkedValue);
}
