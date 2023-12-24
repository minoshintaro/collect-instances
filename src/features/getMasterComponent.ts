const selectedComponentNames = figma.currentPage.selection.map(node => node.name);

// export function getMasterComponent(nodes: SceneNode[]) {
//   const components: ComponentNode[] = [];
//   nodes.forEach(node => {
//     if (node.type === 'INSTANCE' && node.mainComponent) components.push(node.mainComponent);
//     if (node.type === 'COMPONENT_SET') node.children.forEach(node => if (node.type === 'COMPONENT') components.push(node));
//     if (node.type === 'COMPONENT') components.push(node);
//   });
//   return components;
// }
