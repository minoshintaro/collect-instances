import { Name, LayoutProp, ThemeProp } from "./types";

export const LAYOUT_MODE: { [key: string]: AutoLayoutMixin['layoutMode'] } = {
  'COL': 'VERTICAL',
  'ROW': 'HORIZONTAL',
  'WRAP': 'HORIZONTAL'
};

export const NAME: Name = {
  page: `\u{1F50D} Instance Collections`,
  frame: {
    full: 'Collections',
    partial: 'Collection'
  },
  variant: {
    standard: 'Standard'
  }
};

export const ROBOT_R: FontName = { family: 'Roboto', style: 'Regular' };
export const ROBOT_B: FontName = { family: 'Roboto', style: 'Bold' };

export const LINK_COLOR: Paint = { type: 'SOLID', color: { r: 0 / 255, g: 100 / 255, b: 200 / 255 } };
export const DARK_GRAY: Paint = { type: 'SOLID', color: { r: 77 / 255, g: 77 / 255, b: 77 / 255 } };
export const LIGHT_GRAY: Paint = { type: 'SOLID', color: { r: 230 / 255, g: 230 / 255, b: 230 / 255 } };
export const BLACK: Paint = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } };
export const WHITE: Paint = { type: 'SOLID', color: { r: 1, g: 1, b: 1 } };

export const DROP_SHADOW: DropShadowEffect = {
  type: "DROP_SHADOW",
  color: { r: 0, g: 0, b: 0, a: 0.2 }, // 影の色（RGBA）
  offset: { x: 0, y: 0 }, // 影のオフセット（X, Y）
  radius: 8, // 影のぼかしの半径
  visible: true, // 影を表示するかどうか
  blendMode: "NORMAL", // ブレンドモード
  spread: 0 // 影の広がり（Figma APIでは現在サポートされていない可能性がある）
};

export const LAYOUT: { [key: string]: LayoutProp } = {
  container: { flow: 'WRAP', gap: [200] },
  section: { flow: 'COL', gap: [48] },
  sectionRow: { flow: 'ROW', gap: [48] },
  sectionColumn: { flow: 'COL', gap: [24] },
  unit: { flow: 'COL', gap: [16] },
  figure: { flow: 'COL', align: 'CENTER', padding: [24, 0] }
}
export const THEME: { [key: string]: ThemeProp } = {
  figure: { radius: 8, fills: [WHITE], effect: DROP_SHADOW },
}
