export const MONOGRAM_INK = '#FF0000';
export const MONOGRAM_PAPER = '#0b0b0c';
export const MONOGRAM_PNG_SIZE = 2400;

export function monogramSvg({ size, paths }, transparent = true) {
  const background = transparent ? '' : `<rect width="${size}" height="${size}" fill="${MONOGRAM_PAPER}"/>`;
  const ink = paths.map(({ d, width }) => `<path d="${d}" stroke-width="${width}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`
    + background
    + `<g fill="none" stroke="${MONOGRAM_INK}" stroke-linecap="round" stroke-linejoin="round">${ink}</g></svg>`;
}

export async function monogramPng({ size, paths }, transparent = true) {
  const canvas = document.createElement('canvas');
  canvas.width = MONOGRAM_PNG_SIZE;
  canvas.height = MONOGRAM_PNG_SIZE;
  try {
    const ink = canvas.getContext('2d');
    if (!ink) throw new Error('Canvas 2D unavailable');
    const scale = MONOGRAM_PNG_SIZE / size;
    ink.scale(scale, scale);
    if (!transparent) {
      ink.fillStyle = MONOGRAM_PAPER;
      ink.fillRect(0, 0, size, size);
    }
    ink.strokeStyle = MONOGRAM_INK;
    ink.lineCap = 'round';
    ink.lineJoin = 'round';
    for (const { d, width } of paths) {
      ink.lineWidth = width;
      ink.stroke(new Path2D(d));
    }
    const png = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!png) throw new Error('PNG encoding failed');
    return png;
  } finally {
    canvas.width = 0;
    canvas.height = 0;
  }
}

export function downloadMonogram(blob, extension) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `sigil-monogram.${extension}`;
  document.body.append(link);
  try {
    link.click();
  } finally {
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }
}
