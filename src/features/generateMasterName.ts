// import { getComponentFullName } from "./getComponentFullName";

export function generateMasterName(node: ComponentNode): string {
  const fullName = node.parent && node.parent.type === 'COMPONENT_SET'
      ? [node.parent.name, node.name]
      : [node.name];
  return fullName.length === 2
    ? `${fullName[0]} / ${fullName[1]}`
    : fullName[0];
}

// export function generateMasterName(node: InstanceNode): string {
//   if (!node.mainComponent) return 'Anonymous';
//   const masterName = getComponentFullName(node.mainComponent);
//   return masterName.length === 2
//     ? `${masterName[0]} / ${masterName[1]}`
//     : masterName[0];
// }
