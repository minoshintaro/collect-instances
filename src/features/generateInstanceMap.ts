export function generateInstanceMap(nodes: readonly SceneNode[]): Map<InstanceNode['mainComponent'], InstanceNode[]> {
  const instanceMap = new Map<InstanceNode['mainComponent'], InstanceNode[]>();
  let stockNodes: SceneNode[] = [...nodes];

  while (stockNodes.length > 0) {
    let temp: SceneNode[] = [];

    for (const node of stockNodes) {
      if (!node || !node.visible) continue;
      if (node.type === 'INSTANCE') {
        const key = node.mainComponent;
        const values = instanceMap.get(key) || [];
        values.push(node);
        instanceMap.set(key, values);
      } else if (node.type === 'FRAME' || node.type === 'GROUP' || node.type === 'SECTION') {
        temp.push(...node.children);
      }
    }

    stockNodes = temp;
  }

  return instanceMap;
}
