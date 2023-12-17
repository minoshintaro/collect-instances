export function getRootFrameName(instance: InstanceNode): string | null {



  let currentNode: BaseNode | null = instance;

  // ルートフレームに到達するまで親ノードを遡る
  while (currentNode && currentNode.type !== 'DOCUMENT') {
    if (currentNode.type === 'FRAME' || currentNode.type === 'COMPONENT') {
      const parent = currentNode.parent;
      if (!parent || parent.type === 'DOCUMENT') {
        // 最上位のフレームまたはコンポーネントに到達
        return currentNode.name;
      }
    }
    currentNode = currentNode.parent;
  }

  return null; // ルートフレームが見つからない場合
}
