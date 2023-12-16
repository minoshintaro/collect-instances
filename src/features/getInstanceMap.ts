import { getComponentName } from "./getComponentName";

export function getInstanceMap() {
  const result = new Map<string, InstanceNode[]>();

  // すべてのインスタンスを取得する
  const instances = figma.currentPage.findAllWithCriteria({
    types: ['INSTANCE']
  });

  // 非表示・入れ子インスタンスなら偽
  const isTarget = (node: InstanceNode): boolean => {
    if (!node.visible) return false;
    let parent = node.parent;
    while (parent) {
      if (parent.type === 'COMPONENT' || parent.type === 'INSTANCE') return false;
      parent = parent.parent;
    }
    return true;
  }

  // コンポーネント名にインスタンスをぶら下げる
  for (const instance of instances) {
    if (!isTarget(instance)) continue;

    // キーになるコンポーネント名
    const name = getComponentName(instance);
    if (!result.has(name)) {
      result.set(name, []);
    }

    // Mapにインスタンスをセットする
    const list = result.get(name);
    if (list) list.push(instance);
  }

  // 並び替え
  result.forEach(instances => {
    instances.sort((a, b) => b.width - a.width);
  });

  return result;
}

