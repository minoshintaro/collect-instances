import { getComponentName } from "./getComponentName";

export function getInstanceMap() {

  // すべてのインスタンスを取得する
  const instances = figma.currentPage.findAllWithCriteria({
    types: ['INSTANCE']
  });

  // 入れ子のインスタンスを除外する
  const filteredInstances = instances.filter(instance => {
    if (!instance.visible) return false;

    let parent = instance.parent;
    while (parent) {
      if (parent.type === 'COMPONENT' || parent.type === 'INSTANCE') return false;
      parent = parent.parent;
    }
    return true;
  });

  // コンポーネント名ごとにインスタンスをまとめる
  const instanceMap = new Map<string, InstanceNode[]>()
  filteredInstances.forEach(instance => {
    const name = getComponentName(instance);

    if (!instanceMap.has(name)) {
      instanceMap.set(name, []);
    }

    const list = instanceMap.get(name);
    if (list) {
      list.push(instance);
    }
  });

  // const sortedInstances = filteredInstances.sort((a, b) => {
  //   const nameA = a.mainComponent ? a.mainComponent.name.toUpperCase() : "";
  //   const nameB = b.mainComponent ? b.mainComponent.name.toUpperCase() : "";
  //   return nameA.localeCompare(nameB);
  // });
  // console.log('test', instances, sortedInstances);

  return instanceMap;
}


