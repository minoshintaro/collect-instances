export function getTime(start: Date, end: Date): string {
  return `${end.getTime() - start.getTime()}ms`;
}

// export function getComponentFullName(node: ComponentNode): string[] {
//   return node.parent && node.parent.type === 'COMPONENT_SET' ? [node.parent.name, node.name] : [node.name];
// }

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
      case 'STAR': return node[prop as keyof StarNode];
      case 'TEXT': return node[prop as keyof TextNode];
      case 'VECTOR': return node[prop as keyof VectorNode];
      default: return 'NO_VALUE';
    }
  })();
  return JSON.stringify(checkedValue);
}
