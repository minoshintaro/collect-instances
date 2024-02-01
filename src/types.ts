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

export type ComponentMap = Map<string, VariantMap>; // key: マスター名
export type VariantMap = Map<string, InstanceMap>; // key: コンポーネントID
export type InstanceMap = Map<string, InstancePropMap>; // key: コンテンツ
export type InstancePropMap = Map<string, InstanceDataList>; // key: 上書き属性値
export type InstanceDataList = InstanceData[];
export interface InstanceData {
  id: BaseNodeMixin['id'];
  width: DimensionAndPositionMixin['width'];
  height: DimensionAndPositionMixin['height'];
  background: MinimalFillsMixin['fills'];
  location: {
    name: BaseNodeMixin['name'];
    width: DimensionAndPositionMixin['width'];
    height: DimensionAndPositionMixin['height'];
  }
}

export interface CommonProp {
  parent?: ContainerNode | PageNode;
  name?: BaseNodeMixin['name'];
  visible?: SceneNodeMixin['visible'];
}

export interface LayoutProp {
  flow?: 'ROW' | 'COL' | 'WRAP';
  align?: 'CENTER';
  gap?: number[];
  padding?: number[];
  w?: number;
  h?: number;
  minW?: DimensionAndPositionMixin['minWidth'];
}

export interface ThemeProp {
  radius?: CornerMixin['cornerRadius'];
  fills?: MinimalFillsMixin['fills'];
  effect?: DropShadowEffect;
}

export interface FrameProp extends CommonProp {
  children?: (FrameNode | TextNode | InstanceNode)[];
  layout?: LayoutProp;
  theme?: ThemeProp;
}

export interface TextProp extends CommonProp {
  content?: NonResizableTextMixin['characters'];
  link?: HyperlinkTarget['value'];
  font?: NonResizableTextMixin['fontName'];
  size?: NonResizableTextMixin['fontSize'];
  color?: MinimalFillsMixin['fills'];
}
