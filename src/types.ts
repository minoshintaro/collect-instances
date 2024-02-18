export type ContainerNode =
  | BooleanOperationNode
  | ComponentNode
  | ComponentSetNode
  | FrameNode
  | GroupNode
  | InstanceNode
  | PageNode
  | SectionNode;

export interface Name {
  page: string,
  frame: {
    [key: string]: string
  },
  variant: {
    [key: string]: string
  }
}

export interface ResultName {
  page: string;
  frame: {
    full: string;
    partial: string;
  };
}

export interface ComponentCatalog {
  index: Map<string, KeySet>; // key: FirstName
  component: Map<string, ComponentData>; // key: ComponentId
  instance: Map<string, InstanceData>; // key: InstanceId
}

export type KeySet = Set<string>;

export interface ComponentData {
  name: string; // VariantName
  patterns: Map<string, Pattern>; // key: prop
}

export interface Pattern {
  id: string;
  width: DimensionAndPositionMixin['width'];
  height: DimensionAndPositionMixin['height'];
  wrapper: {
    width: DimensionAndPositionMixin['width'];
    height: DimensionAndPositionMixin['height'];
    fills: MinimalFillsMixin['fills'];
  }
  instanceIds: KeySet;
}

export interface InstanceData {
  location: BaseNodeMixin['name'];
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
