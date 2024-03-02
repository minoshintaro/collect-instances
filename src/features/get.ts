export function getTime(start: Date, end: Date): string {
  return `${end.getTime() - start.getTime()}ms`;
}

export function getNodeValue(node: SceneNode, prop: NodeChangeProperty): string {
  /** Size */
  if (['width', 'height'].includes(prop)) {
    let value: number = 0;
    if (prop === 'width') value = node.width;
    if (prop === 'height') value = node.height;
    if (value > 0) return JSON.stringify(Math.round(value * 10) / 10);
  }

  if (['opacity'].includes(prop)) {
    let value: number = 0;
    if (prop === 'opacity' && prop in node) value = node.opacity;
    if (value > 0) return JSON.stringify(Math.round(value * 100) / 100);
  }

  /** Fills, Strokes */
  if (prop === 'fills' && prop in node && Array.isArray(node.fills)) {
    const newFills = [...node.fills].map(fill => {
      if (fill.type === 'SOLID'){
        return Object.assign({}, fill, {
          color: {
            r: Math.floor(fill.color.r * 255),
            g: Math.floor(fill.color.g * 255),
            b: Math.floor(fill.color.b * 255)
          }
        });

      } else {
        return fill;
      }
    });
    return JSON.stringify(newFills);
  }

  /** StyleId */
  if (['fillStyleId', 'textStyleId', 'effectStyleId', 'strokeStyleId', 'gridStyleId'].includes(prop)) {
    let styleId: string = '';
    if (prop === 'fillStyleId' && prop in node && typeof node.fillStyleId === 'string') styleId = node.fillStyleId;
    if (prop === 'textStyleId' && prop in node && typeof node.textStyleId === 'string') styleId = node.textStyleId;
    if (prop === 'effectStyleId' && prop in node && typeof node.effectStyleId === 'string') styleId = node.effectStyleId;
    if (prop === 'strokeStyleId' && prop in node && typeof node.strokeStyleId === 'string') styleId = node.strokeStyleId;
    if (prop === 'gridStyleId' && prop in node && typeof node.gridStyleId === 'string') styleId = node.gridStyleId;
    const style = figma.getStyleById(styleId);
    if (style) return JSON.stringify(style.name);
  }

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
      case 'STAR': return node[prop as keyof StarNode];
      case 'TEXT': return node[prop as keyof TextNode];
      case 'VECTOR': return node[prop as keyof VectorNode];
      default: return 'NO_VALUE';
    }
  })();

  return JSON.stringify(checkedValue);
}
