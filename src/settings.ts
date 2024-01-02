import { CreationType } from "./types";

export const PAGE_NAME = `\u{1F50D} Instance Collections`;
export const FRAME_NAME = 'Collections';

export const FONT_NAME = { family: 'Roboto', style: 'Medium' };

export const LINK_COLOR: ReadonlyArray<Paint> = [{ type: 'SOLID', color: { r: 0 / 255, g: 100 / 255, b: 200 / 255 } }];
export const LIGHT_GRAY: ReadonlyArray<Paint> = [{ type: 'SOLID', color: { r: 230 / 255, g: 230 / 255, b: 230 / 255 } }];
export const BLACK: ReadonlyArray<Paint> = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
export const WHITE: ReadonlyArray<Paint> = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];

export const CREATION: CreationType = {
  layoutFrame: {
    name: FRAME_NAME,
    layout: { flow: 'WRAP', gap: [200], maxW: 99999 } // 保留 maxW
  },
  columnFrame: {
    name: 'Column',
    layout: { flow: 'COL', gap: [20] }
  },
  rowFrame: {
    name: 'Row',
    layout: { flow: 'ROW', gap: [100] }
  },
  heading: {
    name: 'Heading',
    text: { value: 'Component Name' },
    layout: { flow: 'COL', padding: [4, 24] },
    theme: { fontSize: 24, fill: [BLACK, WHITE], radius: 9999 }
  },
  subHeading: {
    name: 'Sub Heading',
    text: { value: 'Component Name' },
    layout: { flow: 'COL', padding: [4, 24] },
    theme: { fontSize: 16, fill: [BLACK, WHITE], radius: 9999 }
  },
  link: {
    name: 'Link',
    text: { value: 'Link' },
    layout: { flow: 'COL', padding: [4, 14] },
    theme: { fontSize: 14, fill: [LIGHT_GRAY, LINK_COLOR], radius: 9999 }
  }
}

export const LAYOUT_MODE: { [key: string]: AutoLayoutMixin['layoutMode'] } = {
  'COL': 'VERTICAL',
  'ROW': 'HORIZONTAL',
  'WRAP': 'HORIZONTAL'
};
