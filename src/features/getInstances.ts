export function getInstances(): InstanceNode[] {
  const isTarget = (node: SceneNode): node is InstanceNode => {
    if (!node.visible || node.type !== 'INSTANCE') return false;

    let parent = node.parent;
    while (parent) {
      if (parent.type === 'COMPONENT' || parent.type === 'INSTANCE') return false;
      parent = parent.parent;
    }

    return true;
  };

  const instances = figma.currentPage.children.filter(isTarget); // as InstanceNode[]
  const sortedInstances = instances.sort((a, b) => {
    const nameA = a.mainComponent ? a.mainComponent.name.toUpperCase() : "";
    const nameB = b.mainComponent ? b.mainComponent.name.toUpperCase() : "";
    return nameA.localeCompare(nameB);
  });
  // console.log('test', instances, sortedInstances);

  return instances;
}
