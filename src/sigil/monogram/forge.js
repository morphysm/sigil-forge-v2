import { planComposition } from './composition';

export const MONOGRAM_SIZE = 640;
export const MAX_MONOGRAM_LETTERS = 32;
const INSET = 73;
const MONOGRAM_LINE_SCALE = 0.72;

const distance = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const angle = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const pathLength = points => points.slice(1).reduce((sum, point, index) => sum + distance(points[index], point), 0);

function seededRandom(seed) {
  let value = 2166136261;
  for (const letter of seed) value = Math.imul(value ^ letter.codePointAt(0), 16777619);
  return () => {
    value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function singleGlyph(strokes, detail) {
  const structural = strokes.filter(stroke => !stroke.accent)
    .sort((a, b) => pathLength(b.points) - pathLength(a.points));
  return [
    ...structural.slice(0, 2 + Math.round(detail * 4)),
    ...strokes.filter(stroke => stroke.accent).slice(0, 6),
  ].map(({ points, accent }, index) => ({
    points,
    width: accent ? 6.5 : index === 0 ? 14.2 : 9.5,
    sources: [0],
  }));
}

function pathData(points, rounding) {
  // Bézier controls stay inside the plate even when neighboring spans turn sharply.
  const coordinate = point => point.map(value => Math.round(clamp(value, 16, MONOGRAM_SIZE - 16) * 100) / 100).join(' ');
  let path = `M${coordinate(points[0])}`;
  for (let index = 1; index < points.length; index++) {
    const end = points[index];
    if (!rounding || points.length <= 2) {
      path += `L${coordinate(end)}`;
      continue;
    }
    const start = points[index - 1];
    const prev = points[Math.max(index - 2, 0)];
    const next = points[Math.min(index + 1, points.length - 1)];
    const handle = distance(start, end) * rounding;
    const a = angle(prev, end);
    const b = angle(start, next);
    path += `C${coordinate([start[0] + Math.cos(a) * handle, start[1] + Math.sin(a) * handle])} `
      + `${coordinate([end[0] - Math.cos(b) * handle, end[1] - Math.sin(b) * handle])} ${coordinate(end)}`;
  }
  return path;
}

function composePaths(strokes, form, random) {
  const lean = (random() - 0.5) * (0.09 + form * 0.28);
  const phase = random() * Math.PI * 2;
  const bend = ([x, y]) => [x + lean * y + Math.sin(y * 0.25 + phase) * form * 0.32, y];
  const points = strokes.flatMap(stroke => stroke.points.map(bend));
  const left = Math.min(...points.map(([x]) => x));
  const right = Math.max(...points.map(([x]) => x));
  const top = Math.min(...points.map(([, y]) => y));
  const bottom = Math.max(...points.map(([, y]) => y));
  const scale = (MONOGRAM_SIZE - INSET * 2) / Math.max(right - left, bottom - top, 8);
  const center = MONOGRAM_SIZE / 2;
  const mapPoint = point => {
    const [x, y] = bend(point);
    return [center + (x - (left + right) / 2) * scale, center + (y - (top + bottom) / 2) * scale];
  };

  return strokes.map(({ points, width, sources }) => ({
    d: pathData(points.map(mapPoint), form * 0.2),
    width: Math.round(width * MONOGRAM_LINE_SCALE * (1 - form * 0.08) * 100) / 100,
    sources,
  }));
}

export function forgeMonogram(glyphs, { seed = '', variant = 0, form = 0.44, intricacy = 0.5 } = {}) {
  if (!glyphs.length || glyphs.length > MAX_MONOGRAM_LETTERS) return null;
  const letters = glyphs.map(({ letter }) => letter);
  const random = seededRandom(JSON.stringify(['monogram-v2', letters, seed]));
  const revision = Number.isSafeInteger(variant) && variant >= 0 ? variant : 0;
  const organic = Number.isFinite(form) ? clamp(form, 0, 1) : 0.44;
  const detail = Number.isFinite(intricacy) ? clamp(intricacy, 0, 1) : 0.5;
  const strokes = glyphs.length === 1
    ? singleGlyph(glyphs[0].strokes, detail)
    : planComposition(glyphs, detail, revision, random);
  const style = seededRandom(JSON.stringify([letters, seed, revision]));
  return { size: MONOGRAM_SIZE, paths: composePaths(strokes, organic, style), letters };
}
