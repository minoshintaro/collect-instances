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
    .map(node => node.characters)
    .join(' ');
}
