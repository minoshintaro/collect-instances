export type ContainerNode =
  | BooleanOperationNode
  | ComponentNode
  | ComponentSetNode
  | FrameNode
  | GroupNode
  | InstanceNode
  | PageNode
  | SectionNode;

export interface ResultName {
  page: string;
  frame: {
    full: string;
    partial: string;
  };
}

export interface ComponentCatalog {
  index: Map<string, KeySet>;
  component: Map<string, ComponentData>;
  instance: Map<string, InstanceData>;
}
export type KeySet = Set<string>;
export interface ComponentData {
  variant: string;
  scenes: Map<string, KeySet>;
}
export interface InstanceData {
  width: DimensionAndPositionMixin['width'];
  height: DimensionAndPositionMixin['height'];
  background: MinimalFillsMixin['fills'];
  wrapper: {
    name: BaseNodeMixin['name'];
    width: DimensionAndPositionMixin['width'];
    height: DimensionAndPositionMixin['height'];
  }
}

export interface BaseProp {
  parent?: ContainerNode | PageNode;
  name?: string;
  visible?: boolean;
}

export interface SizeProp {
  w?: number;
  h?: number;
  minW?: number;
  maxW?: number;
}

export interface LayoutProp {
  flow?: 'ROW' | 'COL' | 'WRAP';
  align?: 'CENTER';
  gap?: number[];
  padding?: number[];
}

export interface ThemeProp {
  radius?: CornerMixin['cornerRadius'];
  fills?: MinimalFillsMixin['fills'];
  effect?: DropShadowEffect;
}

export interface FrameProp extends BaseProp, SizeProp {
  children?: (FrameNode | TextNode | InstanceNode)[];
  layout?: LayoutProp;
  theme?: ThemeProp;
}

export interface TextProp extends BaseProp, SizeProp {
  content?: NonResizableTextMixin['characters'];
  link?: HyperlinkTarget['value'];
  font?: NonResizableTextMixin['fontName'];
  size?: NonResizableTextMixin['fontSize'];
  color?: MinimalFillsMixin['fills'];
}
