export interface Target {
  page: PageNode;
  nodes: SceneNode[];
  selection: ComponentNode[];
}

export interface CreationProps {
  layoutFrame: ElementProps,
  stackFrame: ElementProps,
  heading: ElementProps,
  link: ElementProps
}

export interface ElementProps {
  name: string;
  text?: {
    value: string;
    link?: SceneNode;
  };
  layout?: {
    flow?: 'ROW' | 'COL' | 'WRAP';
    gap?: number[];
    padding?: number[];
    minW?: number;
    maxW?: number;
  };
  theme?: {
    fontSize?: number;
    fill?: ReadonlyArray<Paint>[];
    radius?: CornerMixin['cornerRadius'];
  };
}

export interface ExistingFrame {
  name: string,
  parent: PageNode,
  init: boolean
}

export type InstanceCatalog = {
  map: Map<ComponentNode, InstanceData[]>;
  unknown: InstanceData[];
}

export interface InstanceData {
  node: InstanceNode;
  text: string;
  location: SceneNode;
}

export type HasChildren =
  | BooleanOperationNode
  | ComponentNode
  | ComponentSetNode
  | FrameNode
  | GroupNode
  | InstanceNode
  | PageNode
  | SectionNode;
