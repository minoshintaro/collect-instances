import { HasChildren } from "../types";

export function getInnerText(node: HasChildren): string {
  return node
    .findAllWithCriteria({ types: ['TEXT'] })
    .filter(node => node.visible)
    .map(node => node.characters)
    .join(' ');
}
