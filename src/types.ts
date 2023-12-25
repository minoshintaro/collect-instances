export type HasChildren =
  | BooleanOperationNode
  | ComponentNode
  | ComponentSetNode
  | FrameNode
  | GroupNode
  | InstanceNode
  | PageNode
  | SectionNode;

export type InstanceMap = Map<InstanceNode['mainComponent'], InstanceData[]>;

export interface InstanceMapProps {
  targets: readonly SceneNode[],
  scopes: ComponentNode[]
}

export interface InstanceData {
  node: InstanceNode;
  text: string;
  location: SceneNode;
}

export interface LayoutFramePorps {
  parent?: HasChildren;
  name: string;
  flow: AutoLayoutMixin['layoutMode'];
  wrap: AutoLayoutMixin['layoutWrap'];
  gap: number;
}

export interface LabelProps {
  parent?: HasChildren;
  name: string;
  link?: SceneNode;
  theme: Theme;
}

export interface CloneProps {
  parent?: HasChildren;
  node: SceneNode;
}

export interface Theme {
  size: number;
  px: number;
  py: number;
  fill: ReadonlyArray<Paint>[];
}

