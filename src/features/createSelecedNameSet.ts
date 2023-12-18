export function createSelecedNameSet(nodes: SceneNode[]) {
  const newSet = new Set<string>();

  for (const node of nodes) {
    if (node.type === 'COMPONENT') {
      if (node.parent && node.parent.type === 'COMPONENT_SET') {
        newSet.add(node.parent.name);
      } else {
        newSet.add(node.name);
      }
      continue;
    }

  }
}
