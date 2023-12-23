export interface LayoutFramePorps {
  target: PageNode;
  name: string;
  flow: AutoLayoutMixin['layoutMode'];
  wrap: AutoLayoutMixin['layoutWrap'];
  gap: number;
}
