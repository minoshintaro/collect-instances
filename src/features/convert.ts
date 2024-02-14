
export function convertStyleId(input: string | typeof figma.mixed): string {
  if (typeof input !== 'string') return JSON.stringify(input);

  const style = figma.getStyleById(input);
  return style ? style.name : 'NULL';
}

export function convertFills(input: readonly Paint[] | typeof figma.mixed): string {
  if (!Array.isArray(input)) return JSON.stringify(input);

  const results = input.map(paint => {
    if (paint.type === 'SOLID') {
      const newPaint = {
        type: paint.type,
        color: {
          r: Math.round(paint.color.r * 255),
          g: Math.round(paint.color.g * 255),
          b: Math.round(paint.color.b * 255)
        },
        visible: paint.visible,
        opacity: paint.opacity,
        blendMode: paint.blendMode
      }
      return newPaint;
    } else {
      return paint;
    }
  });
  return JSON.stringify(results);
}
