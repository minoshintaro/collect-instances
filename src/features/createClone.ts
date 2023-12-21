export function createClone(node: InstanceNode): InstanceNode {
  const newClone = node.clone();

  // newClone.resize(node.width, node.height);
  newClone.layoutPositioning = 'AUTO';

  return newClone;
}
