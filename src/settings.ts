import { Theme } from "./types";

export const PAGE_NAME = 'Instances';
export const FRAME_NAME = 'Collections';
export const FONT_NAME = { family: 'Roboto', style: 'Medium' };

export const LINK_COLOR: ReadonlyArray<Paint> = [{ type: 'SOLID', color: { r: 0 / 255, g: 100 / 255, b: 200 / 255 } }];
export const LIGHT_GRAY: ReadonlyArray<Paint> = [{ type: 'SOLID', color: { r: 230 / 255, g: 230 / 255, b: 230 / 255 } }];
export const BLACK: ReadonlyArray<Paint> = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
export const WHITE: ReadonlyArray<Paint> = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];

export const HEADING_THEME: Theme = {
  size: 24,
  px: 24,
  py: 4,
  fill: [BLACK, WHITE]
}
export const LINK_THEME: Theme = {
  size: 14,
  px: 14,
  py: 4,
  fill: [LIGHT_GRAY, LINK_COLOR]
}

