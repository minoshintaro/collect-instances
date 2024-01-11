export interface ResultName {
  page: string;
  frame: {
    full: string;
    partial: string;
  };
}

export interface NodeGroup {
  instance: InstanceNode[];
  selection: SceneNode[];
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
    // minW?: number;
    // maxW?: number;
  };
  theme?: {
    fontSize?: number;
    fill?: ReadonlyArray<Paint>[];
    radius?: CornerMixin['cornerRadius'];
  };
}

export type MasterNameMap = Map<string, ComponentIdMap>;
export type ComponentIdMap = Map<string, ContentMap>;
export type ContentMap = Map<string, InstanceIdMap>;
export type InstanceIdMap = Map<string, InstanceProp>;
export interface InstanceProp {
  location: string;
}

export type ContainerNode =
  | BooleanOperationNode
  | ComponentNode
  | ComponentSetNode
  | FrameNode
  | GroupNode
  | InstanceNode
  | PageNode
  | SectionNode;
