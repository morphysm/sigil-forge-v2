import { isJapaneseLetter } from './glyphs';

// Spare-style inscription: one enclosing frame letter, smaller letters nested
// inside it, and the remaining letters stacked as small marks on the vertical
// axis above and below. Coordinates use the 10-unit glyph grid.

// Interior boxes [centerX, centerY, width, height] where nested letters fit
// without touching the frame's strokes.
const frames = {
  A: [[4.5, 8.1, 3.4, 2.6], [4.5, 3.7, 1.5, 2.2]],
  V: [[5, 3, 4.6, 4], [5, 7, 1.6, 1.6]],
  M: [[5, 8.4, 4.2, 2.6], [5, 2.4, 2.6, 2.6]],
  W: [[5, 1.9, 4.2, 2.6], [5, 8.3, 2.4, 2.4]],
  O: [[5, 5, 5.4, 5.4]],
  U: [[5, 4.6, 5.4, 5.4]],
  C: [[5.3, 5, 5, 5.4]],
  E: [[4.8, 2.5, 4.6, 3.2], [4.8, 7.5, 4.6, 3.2]],
  H: [[5, 2.5, 5.8, 3.4], [5, 7.5, 5.8, 3.4]],
  D: [[4.6, 5, 4.8, 6]],
  П: [[5, 5.6, 5.8, 6.2]],
  Л: [[5.9, 6, 3.6, 5]],
  Ц: [[4.5, 4.2, 5.2, 6]],
  Ш: [[2.5, 5, 3.4, 7], [7.5, 5, 3.4, 7]],
  Q: [[5, 5, 5.4, 5.4]],
  G: [[4.2, 5, 3.6, 5.2]],
};
const rank = Object.keys(frames);
// Cyrillic letters drawn with the same template as a Latin frame.
const alias = { А: 'A', Е: 'E', М: 'M', Н: 'H', О: 'O', С: 'C' };

const MARK = 2.1;
const GAP = 0.55;
const WIDTH = { frame: 12, nested: 8, mark: 5.5, spine: 6.5 };

const distance = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);

function segmentDistance(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const span = dx * dx + dy * dy;
  const t = span ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / span)) : 0;
  return distance(p, [a[0] + dx * t, a[1] + dy * t]);
}

const polylineDistance = (p, points) => points.slice(1)
  .reduce((best, b, i) => Math.min(best, segmentDistance(p, points[i], b)), Infinity);

function bounds(points) {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  return { left: Math.min(...xs), right: Math.max(...xs), top: Math.min(...ys), bottom: Math.max(...ys) };
}

const strokeLength = glyph => glyph.strokes.reduce((sum, { points }) => sum + points.slice(1)
  .reduce((total, point, i) => total + distance(points[i], point), 0), 0);

const frameKey = letter => {
  const base = letter.normalize('NFD')[0];
  return alias[base] ?? base;
};

// A guest letter is already present when every one of its segments lies on a
// segment of the host. Returns the host strokes that carry it, or null.
function coverage(host, guest) {
  const carriers = new Set();
  for (const { points } of guest.strokes) {
    for (let i = 1; i < points.length; i++) {
      const index = host.strokes.findIndex(({ points: line }) => line.slice(1).some((b, j) => (
        segmentDistance(points[i - 1], line[j], b) < 0.06 && segmentDistance(points[i], line[j], b) < 0.06
      )));
      if (index < 0) return null;
      carriers.add(index);
    }
  }
  return carriers;
}

function turn(a, b, c) {
  const delta = Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(b[1] - a[1], b[0] - a[0]);
  return Math.abs(Math.atan2(Math.sin(delta), Math.cos(delta)));
}

function chaikin(points) {
  let line = points;
  for (let pass = 0; pass < 3; pass++) {
    const next = [line[0]];
    for (let i = 0; i < line.length - 1; i++) {
      const [a, b] = [line[i], line[i + 1]];
      next.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25]);
      next.push([a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    }
    next.push(line.at(-1));
    line = next;
  }
  return line;
}

// Round the gentle turns of curved letters into true curves. Sharp corners
// (M, W, the bar of G) stay crisp. Output remains a polyline.
function smooth(points) {
  // Short polylines are angular letters (A, V, N, Z); only longer ones carry curves.
  if (points.length < 5) return points;
  const closed = distance(points[0], points.at(-1)) < 0.001;
  const sharp = index => turn(points[index - 1], points[index], points[index + 1]) > 1.15;
  if (closed) {
    const corners = points.slice(1, -1).some((_, i) => sharp(i + 1))
      || turn(points.at(-2), points[0], points[1]) > 1.15;
    if (!corners) {
      // A closed bowl becomes a true ellipse through its outline's extremes.
      const { left, right, top, bottom } = bounds(points);
      const ring = Array.from({ length: 48 }, (_, i) => {
        const angle = -Math.PI / 2 + (i / 48) * Math.PI * 2;
        return [(left + right) / 2 + Math.cos(angle) * (right - left) / 2,
          (top + bottom) / 2 + Math.sin(angle) * (bottom - top) / 2];
      });
      return [...ring, ring[0]];
    }
  }
  const result = [points[0]];
  let run = [points[0]];
  for (let i = 1; i < points.length; i++) {
    run.push(points[i]);
    if (i === points.length - 1 || sharp(i)) {
      const shaped = run.length >= 3 ? chaikin(run) : run;
      result.push(...shaped.slice(1));
      run = [points[i]];
    }
  }
  return result;
}

function place(glyph, [cx, cy, w, h]) {
  const box = bounds(glyph.strokes.flatMap(({ points }) => points));
  const scale = Math.min(w / ((box.right - box.left) || 1), h / ((box.bottom - box.top) || 1));
  const mx = (box.left + box.right) / 2;
  const my = (box.top + box.bottom) / 2;
  return { scale, map: ([x, y]) => [cx + (x - mx) * scale, cy + (y - my) * scale] };
}

function chooseFrame(glyphs, variant) {
  const listed = rank.flatMap(key => glyphs.flatMap((glyph, index) => (
    frameKey(glyph.letter) === key && !isJapaneseLetter(glyph.letter) ? [index] : []
  )));
  const candidates = listed.length
    ? listed
    : glyphs.map((glyph, index) => ({ index, size: strokeLength(glyph) }))
      .sort((a, b) => b.size - a.size).map(({ index }) => index);
  const frame = candidates[variant % candidates.length];
  return { frame, rotation: Math.floor(variant / candidates.length) };
}

const rotate = (list, by) => list.length ? [...list.slice(by % list.length), ...list.slice(0, by % list.length)] : list;

function chunk(list, size) {
  const groups = [];
  for (let i = 0; i < list.length; i += size) groups.push(list.slice(i, i + size));
  return groups;
}

export function inscribeStrokes(glyphs, variant = 0) {
  const { frame, rotation } = chooseFrame(glyphs, variant);
  const boxes = !isJapaneseLetter(glyphs[frame].letter) ? frames[frameKey(glyphs[frame].letter)] ?? [] : [];

  // Spare's reduction: a letter already contained in a larger one is not redrawn.
  const hosts = [frame];
  const absorbed = new Map();
  const bySize = glyphs.map((glyph, index) => index).filter(index => index !== frame)
    .sort((a, b) => strokeLength(glyphs[b]) - strokeLength(glyphs[a]));
  for (const index of bySize) {
    const host = hosts.find(candidate => coverage(glyphs[candidate], glyphs[index]));
    if (host === undefined) hosts.push(index);
    else absorbed.set(index, { host, carriers: coverage(glyphs[host], glyphs[index]) });
  }
  const remaining = rotate(glyphs.map((glyph, index) => index)
    .filter(index => index !== frame && !absorbed.has(index)), rotation);

  // One letter per interior box. Long intentions pair letters in boxes wide
  // enough to hold two, as in Spare's doubled S.
  const groups = boxes.map(() => []);
  const queue = [...remaining];
  boxes.forEach((box, slot) => queue.length && groups[slot].push(queue.shift()));
  if (queue.length > 4) {
    boxes.forEach(([, , w], slot) => w >= 2.6 && queue.length && groups[slot].push(queue.shift()));
  }
  const marks = queue;

  const placements = [{ index: frame, role: 'frame', scale: 1, map: point => point }];
  const frameInk = bounds(glyphs[frame].strokes.filter(({ accent }) => !accent).flatMap(({ points }) => points));
  const axis = (frameInk.left + frameInk.right) / 2;

  boxes.forEach((box, slot) => {
    const group = groups[slot];
    if (!group.length) return;
    const [cx, cy, w, h] = box;
    const cell = w / group.length;
    group.forEach((index, i) => placements.push({
      index, role: 'nested', ...place(glyphs[index], [cx - w / 2 + cell * (i + 0.5), cy, cell * 0.92, h]),
    }));
  });

  const strokes = [];
  const add = (points, width, sources, meta = {}) => {
    const stroke = { points, width, sources: [...new Set(sources)], ...meta };
    strokes.push(stroke);
    return stroke;
  };
  const sourcesFor = (index, strokeIndex) => [index, ...[...absorbed]
    .filter(([, { host, carriers }]) => host === index && carriers.has(strokeIndex)).map(([guest]) => guest)];

  function drawGlyph({ index, role, scale, map }) {
    const japanese = isJapaneseLetter(glyphs[index].letter);
    glyphs[index].strokes.forEach(({ points, accent }, strokeIndex) => {
      const shaped = japanese || accent ? points : smooth(points);
      const ends = [];
      if (!japanese && !accent && role !== 'mark' && distance(points[0], points.at(-1)) > 0.001) {
        const terminal = (end, previous) => points.length === 2 || distance(end, previous) >= 2.4;
        if (terminal(points[0], points[1])) ends.push([map(points[0]), map(points[1])]);
        if (terminal(points.at(-1), points.at(-2))) ends.push([map(points.at(-1)), map(points.at(-2))]);
      }
      add(shaped.map(map), accent ? WIDTH[role] * 0.7 : WIDTH[role], sourcesFor(index, strokeIndex), {
        ends, scale,
      });
    });
  }
  placements.forEach(drawGlyph);

  // The axis meets the inscription at its highest and lowest ink.
  const inner = strokes.map(({ points }) => points);
  const crossings = inner.flatMap(points => points.slice(1).flatMap((b, i) => {
    const a = points[i];
    if (Math.abs(a[0] - axis) < 0.001 && Math.abs(b[0] - axis) < 0.001) return [a[1], b[1]];
    if ((a[0] - axis) * (b[0] - axis) > 0 || a[0] === b[0]) return [];
    return [a[1] + (b[1] - a[1]) * (axis - a[0]) / (b[0] - a[0])];
  }));
  const ink = bounds(inner.flat());
  const anchors = {
    above: crossings.length ? Math.min(...crossings) : ink.top,
    below: crossings.length ? Math.max(...crossings) : ink.bottom,
  };

  const sides = { above: [], below: [] };
  marks.forEach((index, i) => sides[(i + rotation) % 2 ? 'below' : 'above'].push(index));
  for (const [side, letters] of Object.entries(sides)) {
    if (!letters.length) continue;
    const direction = side === 'above' ? -1 : 1;
    const levels = chunk(letters, letters.length <= 3 ? 1 : letters.length <= 8 ? 2 : 3);
    const edge = side === 'above' ? ink.top : ink.bottom;
    const spineSources = [...letters];
    const spine = add([], WIDTH.spine, spineSources, { ends: [], scale: 1 });
    let far = edge;
    levels.forEach((level, depth) => {
      const cy = edge + direction * (GAP + MARK / 2 + depth * (MARK + GAP));
      const span = level.length * MARK + (level.length - 1) * 0.3;
      level.forEach((index, i) => {
        const cx = axis - span / 2 + MARK / 2 + i * (MARK + 0.3);
        drawGlyph({ index, role: 'mark', ...place(glyphs[index], [cx, cy, MARK * 0.9, MARK]) });
      });
      far = cy + direction * MARK / 2;
    });
    spine.points = [[axis, anchors[side]], [axis, far + direction * GAP * 1.1]];
    spine.ends = [[spine.points[1], spine.points[0]]];
    spine.scale = 1.15;
  }

  // Serifs close each free straight stroke end, as on an inscribed capital.
  const serifs = [];
  strokes.forEach(stroke => {
    for (const [end, previous] of stroke.ends) {
      const free = strokes.every(other => other === stroke
        || polylineDistance(end, other.points) > 0.45 * stroke.scale);
      if (!free) continue;
      const vertical = Math.abs(end[1] - previous[1]) >= Math.abs(end[0] - previous[0]);
      const half = 0.45 * stroke.scale;
      serifs.push({
        after: stroke,
        points: vertical
          ? [[end[0] - half, end[1]], [end[0] + half, end[1]]]
          : [[end[0], end[1] - half], [end[0], end[1] + half]],
        width: stroke.width * 0.85,
        sources: stroke.sources,
      });
    }
  });

  return strokes.flatMap(stroke => [stroke, ...serifs.filter(serif => serif.after === stroke)])
    .map(({ points, width, sources }) => ({ points, width, sources }));
}
