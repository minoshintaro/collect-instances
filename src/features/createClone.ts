import { CloneProps } from "../types";

export function createClone(props: CloneProps): SceneNode {
  const { node, parent } = props;
  const newClone = node.clone();
  if ('layoutPositioning' in newClone) newClone.layoutPositioning = 'AUTO';
  if (parent) parent.appendChild(newClone);
  return newClone;
}
