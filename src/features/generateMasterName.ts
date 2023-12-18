import { getComponentFullName } from "./getComponentFullName";

export function generateMasterName(node: InstanceNode): string {
  if (!node.mainComponent) return 'Anonymus';
  const masterName = getComponentFullName(node.mainComponent);
  return node.parent && node.parent.type === 'COMPONENT_SET'
    ? `${masterName[0]} / ${masterName[1]}`
    : masterName[0];
}
