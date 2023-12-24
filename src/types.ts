export interface LayoutFramePorps {
  parent: PageNode;
  name: string;
  flow: AutoLayoutMixin['layoutMode'];
  wrap: AutoLayoutMixin['layoutWrap'];
  gap: number;
}
