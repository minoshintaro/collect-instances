export interface TargetNode {
  page: PageNode;
  nodes: SceneNode[];
  selection: ComponentNode[];
}

export interface CreationType {
  [key: string]: ElementProp
}
export interface ElementProp {
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

export interface InstanceCatalog {
  index: Map<string, InstanceIndex>;
  data: Map<string, InstanceDataList>;
}
export type InstanceIndex = Set<string>;
export type InstanceDataList = InstanceData[];
export type InstanceData = { id: string, content: string };

export type HasChildren =
  | BooleanOperationNode
  | ComponentNode
  | ComponentSetNode
  | FrameNode
  | GroupNode
  | InstanceNode
  | PageNode
  | SectionNode;
