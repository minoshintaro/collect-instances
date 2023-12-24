import { CloneProps } from "../types";

export function createClone(props: CloneProps): SceneNode {
  const { parent, node } = props;
  const newClone = node.clone();

  if ('layoutPositioning' in newClone) newClone.layoutPositioning = 'AUTO';
  if (parent) parent.appendChild(newClone);

  return newClone;
}
