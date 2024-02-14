export function compareWordOrder(a: string, b: string): number {
  return a.localeCompare(b, 'ja-JP-u-co-standard');
}

export function cutText(text: string, max: number) {
  if (text.length > max) return text.slice(0, max);
  return text;
}

// fillsを255のスケールに変換する関数
export function convertRGB(fills: readonly Paint[]): Paint[] {
  return fills.map((fill) => {
    switch (fill.type) {
      case 'SOLID':
        const { r, g, b } = fill.color;
        return {
          ... fill,
          color: {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
          }
        };
      default:
      return fill;
    }
  });
}

// case 'GRADIENT_LINEAR':
//   case 'GRADIENT_RADIAL':
//   case 'GRADIENT_ANGULAR':
//   case 'GRADIENT_DIAMOND':
//     const colorStops = fill.gradientStops.map(colorStop => {
//       const { r, g, b } = colorStop.color;
//       return {
//         ...fill,
//         gradientStops: []
//       }
//     };
//
// }
// if (fill.type.startsWith('GRADIENT')) {
//   // グラデーションの処理
//   const stops = fill.gradientStops.map(stop => {
//     const { r, g, b, a = 1 } = stop.color;
//     return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
//   });
//   return `${fill.type.toLowerCase()}(${stops.join(', ')})`;
// }
// return '';
