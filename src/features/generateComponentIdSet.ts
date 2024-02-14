export function generateComponentIdSet(input: readonly SceneNode[]): Set<string> {
  const result = new Set<string>();

  let targets: SceneNode[] = [...input];
  while (targets.length > 0) {
    const subNodes = targets.reduce((nodes: SceneNode[], target: SceneNode) => {
      switch (target.type) {
        case 'INSTANCE':
          if (target.mainComponent) result.add(target.mainComponent.id);
          return nodes;
        case 'COMPONENT':
          result.add(target.id);
          return nodes;
        case 'COMPONENT_SET':
          target
            .findChildren(child => child.type === 'COMPONENT')
            .forEach(component => result.add(component.id));
          return nodes;
        default:
          return ('children' in target) ? nodes.concat(target.children) : nodes;
      }
    }, []);
    targets = subNodes;
  }

  return result;
}


// export function generateComponentIdSet1(input: readonly SceneNode[]): Set<BaseNodeMixin['id']> {
//   const result = new Set<BaseNodeMixin['id']>();
//
//   let targets = input;
//   while (targets.length > 0) {
//     let subNodes: SceneNode[] = [];
//     targets.forEach(node => {
//       switch (node.type) {
//         case 'INSTANCE':
//           if (node.mainComponent) result.add(node.mainComponent.id);
//           break;
//         case 'COMPONENT':
//           result.add(node.id);
//           break;
//         case 'COMPONENT_SET':
//           node
//             .findChildren(child => child.type === 'COMPONENT')
//             .forEach(component => result.add(component.id));
//           break;
//         case 'BOOLEAN_OPERATION':
//           break;
//         default:
//           if ('children' in node) subNodes = [...subNodes, ...node.children];
//           break;
//       }
//     });
//     targets = subNodes;
//   }
//   console.log('Test', result);
//   return result;
// }
//
