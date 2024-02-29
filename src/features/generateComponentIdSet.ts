export function generateComponentIdSet(input: readonly SceneNode[]): Set<string> {
  const idSet = new Set<string>();

  let targets: SceneNode[] = [...input];
  while (targets.length > 0) {
    const subNodes = targets.reduce((results: SceneNode[], node: SceneNode) => {
      /**
       * [1] インスタンスなら、マスターを参照
       * [2] コンポーネントなら、自身を参照
       * [3] コンポーネントセットなら、子を参照
       * [4] それ以外なら、子要素を走査対象に追加
       */
      switch (node.type) {
        case 'INSTANCE':
          if (node.mainComponent) idSet.add(node.mainComponent.id);
          return results;
        case 'COMPONENT':
          idSet.add(node.id);
          return results;
        case 'COMPONENT_SET':
          node
            .findChildren(child => child.type === 'COMPONENT')
            .forEach(child => idSet.add(child.id));
          return results;
        default:
          return ('children' in node && node.children.length > 0) ? [...results, ...node.children] : results;
      }
    }, []);
    targets = subNodes;
  }

  return idSet;
}
