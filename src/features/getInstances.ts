export function getInstances(): InstanceNode[] {
  const instances = figma.currentPage.children.filter((child): child is InstanceNode => child.type === 'INSTANCE');
  const sortedInstances = instances.sort((a, b) => {
    const nameA = a.mainComponent ? a.mainComponent.name.toUpperCase() : "";
    const nameB = b.mainComponent ? b.mainComponent.name.toUpperCase() : "";
    return nameA.localeCompare(nameB);
  });
  // console.log('test', instances, sortedInstances);
  return sortedInstances;
}
