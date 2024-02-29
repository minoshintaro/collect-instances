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



export type KeySet = Set<string>;



export interface DesignSpec {
  id: string;
  width: number;
  height: number;
  backgrounds: MinimalFillsMixin['fills'];
  wrapperIds: KeySet;
  instanceIds: KeySet;
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
