type HasFindAllWithCriteria =
  BooleanOperationNode |
  ComponentNode |
  ComponentSetNode |
  FrameNode |
  GroupNode |
  InstanceNode |
  PageNode |
  SectionNode;

export function getInnerText(node: HasFindAllWithCriteria): string {
  return node
    .findAllWithCriteria({ types: ['TEXT'] })
    .filter(node => node.visible)
    .map(node => node.characters)
    .join(' ');
}
