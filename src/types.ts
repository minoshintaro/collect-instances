export interface TargetNode {
  page: PageNode;
  nodes: SceneNode[];
  selection: Set<ComponentNode>;
}

export interface MaterialNode {
  [key: string]: FrameNode;
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

export type MasterNameMap = Map<string, ComponentIdMap>;
export type ComponentIdMap = Map<string, ContentMap>;
export type ContentMap = Map<string, InstanceIdSet>;
export type InstanceIdSet = Set<string>;

export type HasChildren =
  | BooleanOperationNode
  | ComponentNode
  | ComponentSetNode
  | FrameNode
  | GroupNode
  | InstanceNode
  | PageNode
  | SectionNode;
