export type HasChildren =
  | BooleanOperationNode
  | ComponentNode
  | ComponentSetNode
  | FrameNode
  | GroupNode
  | InstanceNode
  | PageNode
  | SectionNode;

export interface InstanceCatalogProps {
  targets: readonly SceneNode[];
  scopes: ComponentNode[];
}

export interface InstanceData {
  node: InstanceNode;
  text: string;
  location: SceneNode;
}

export type InstanceCatalog = {
  map: Map<ComponentNode, InstanceData[]>;
  unknown: InstanceData[];
}

export interface CloneProps {
  parent?: HasChildren;
  node: SceneNode;
}

export interface ElementProps {
  name: string;
  parent?: HasChildren;
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
