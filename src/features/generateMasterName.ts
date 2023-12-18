import { getComponentFullName } from "./getComponentFullName";

export function generateMasterName(node: InstanceNode): string {
  if (!node.mainComponent) return 'Anonymous';
  const masterName = getComponentFullName(node.mainComponent);
  return masterName.length === 2
    ? `${masterName[0]} / ${masterName[1]}`
    : masterName[0];
}
