export function findPage(name: string): PageNode | null {
  return figma.root.findChild(child => child.name === name);
}

interface Options {
  name: string;
  page: PageNode;
  init: boolean;
}
export function findFrame(options: Options): FrameNode | null {
  const { name, page, init } = options;
  const existingFrames = page.findChildren(node => node.name === name && node.type === 'FRAME') as FrameNode[];
  existingFrames.forEach(node => {
    if (init) {
      node.remove();
    } else {
      node.visible = false;
    }
  });
  return existingFrames[0];
}

//  if (init) {
//    target.page
//      .findChildren(isExisting)
//      .forEach(node => node.remove());
//    return null;
//  } else {
//    const child = target.page.findChild(isExisting);
//    if (child) {
//      child.visible = false;
//      return child as FrameNode;
//    }
//    return null;
//  }


// export function findFrame(props: ExistingFrame): FrameNode | null {
//   const { name, parent, init } = props;
//   const isExisting = (node: SceneNode): boolean => node.name === name && node.type === 'FRAME';
//
//   if (init) {
//     parent.findChildren(isExisting).forEach(node => node.remove());
//     return null;
//   }
//
//   const child = parent.findChild(isExisting) as FrameNode;
//   return child || null;
// }
