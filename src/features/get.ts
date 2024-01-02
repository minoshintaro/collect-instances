import { HasChildren } from "../types";

export function getFirstNode(node: SceneNode): SceneNode {
  let current = node;
  while (current.parent
    && current.parent.type !== 'DOCUMENT'
    && current.parent.type !== 'PAGE'
    && current.parent.type !== 'SECTION') {
      current = current.parent;
  }
  return current;
}

export function getInnerText(node: HasChildren): string {
  return node
    .findAllWithCriteria({ types: ['TEXT'] })
    .filter(node => node.visible)
    .map(node => node.characters)
    .join(' ');
}

export function getMasterComponents(nodes: SceneNode[]): ComponentNode[] {
  return nodes.flatMap(node => {
    switch (node.type) {
      case 'INSTANCE':
        return node.mainComponent ? [node.mainComponent] : [];
      case 'COMPONENT_SET':
        return node.findChildren(child => child.type === 'COMPONENT') as ComponentNode[];
      case 'COMPONENT':
        return [node];
      default:
        return [];
    }
  });
}
