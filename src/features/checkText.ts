
// function getText(node: InstanceNode): string {
//   const textNodes = node.findAllWithCriteria({ types: ['TEXT'] });
//   let texts: string[] = [];
//   textNodes.forEach(text => texts.push(text.characters));
//   return texts.join(' ');
// }

// function getInstances(instances: InstanceNode[]): [InstanceNode[], InstanceNode[]] {
//   const textMap = new Map<string, InstanceNode[]>();
//   instances.forEach(instance => {
//     const text = getText(instance);
//     const group = textMap.get(text) || [];
//     group.push(instance);
//     textMap.set(text, group);
//   });
//
//   const matchingInstances: InstanceNode[] = [];
//   const nonMatchingInstances: InstanceNode[] = [];
//   textMap.forEach(group => {
//     if (group.length > 1) {
//       matchingInstances.push(...group);
//     } else {
//       nonMatchingInstances.push(...group);
//     }
//   });
//
//   return [matchingInstances, nonMatchingInstances];
// }

// 使用例
// const instances: InstanceNode[] = /* インスタンスの配列 */;
// const [matching, nonMatching] = classifyInstances(instances);
// console.log('一致するインスタンス:', matching);
// console.log('一致しないインスタンス:', nonMatching);











function findAllTextInInstance(instance: InstanceNode): string[] {
  let texts: string[] = [];

  function visit(node: SceneNode) {
    if (node.type === 'TEXT') {
      texts.push(node.characters);
    }
    if ('children' in node) {
      for (const child of node.children) {
        visit(child);
      }
    }
  }

  visit(instance);
  return texts;
}

function classifyInstances(instances: InstanceNode[]): [InstanceNode[], InstanceNode[]] {
  const matchingInstances: InstanceNode[] = [];
  const nonMatchingInstances: InstanceNode[] = [];
  const textMap = new Map<string, InstanceNode[]>();

  for (const instance of instances) {
    const texts = findAllTextInInstance(instance).join(' ');
    if (textMap.has(texts)) {
      textMap.get(texts)?.push(instance);
    } else {
      textMap.set(texts, [instance]);
    }
  }

  textMap.forEach(instanceGroup => {
    if (instanceGroup.length > 1) {
      matchingInstances.push(...instanceGroup);
    } else {
      nonMatchingInstances.push(...instanceGroup);
    }
  });

  return [matchingInstances, nonMatchingInstances];
}
