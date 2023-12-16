export function getInstances(): InstanceNode[] {

  const instances = figma.currentPage.findAllWithCriteria({
    types: ['INSTANCE']
  });

  const filteredInstances = instances.filter(instance => {
    let parent = instance.parent;
    while (parent) {
      if (parent.type === 'COMPONENT' || parent.type === 'INSTANCE') return false;
      parent = parent.parent;
    }
    return true;
  });

  const sortedInstances = filteredInstances.sort((a, b) => {
    const nameA = a.mainComponent ? a.mainComponent.name.toUpperCase() : "";
    const nameB = b.mainComponent ? b.mainComponent.name.toUpperCase() : "";
    return nameA.localeCompare(nameB);
  });
  console.log('test', instances, sortedInstances);

  return sortedInstances;
}
