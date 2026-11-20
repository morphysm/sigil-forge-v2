// A frame is an abstraction of a source feature. Each layout leaves an open pocket.
const frames = {
  spine: {
    outline: [[0, -6], [0, 6]],
    slots: [
      { box: [0, -4.08, 5.8, 0.58], prefer: 'bar', joint: [0, 0.16], cross: true },
      { box: [1.4, -1.6, 2.65, 2.65], prefer: 'arc', joint: [0, 0.29] },
      { box: [-1.55, 0.55, 2.55, 2.48], prefer: 'wedge' },
      { box: [1.4, 2.65, 2.7, 1.78], prefer: 'diagonal', joint: [0, 0.66] },
      { box: [-1.42, 4.35, 2.56, 1.65], prefer: 'bracket' },
      { box: [2.25, 5.08, 1.35, 1.05], prefer: 'loop' },
    ],
    accent: [1.08, -6.75, 1.46, 0.8],
    extraSlots: [
      { box: [-1.43, -1.68, 2.65, 2.25], joint: [0, 0.35] },
      { box: [1.5, 4.9, 2.66, 1.7], joint: [0, 0.92] },
      { box: [1.6, 0.74, 1.68, 1.56] },
    ],
  },
  arc: {
    outline: [[3, -4.7], [1.1, -5.75], [-1.35, -5.75], [-3.25, -4.55], [-4.65, -2.5],
      [-5.02, 0], [-4.6, 2.35], [-3.2, 4.45], [-1.22, 5.55], [1.3, 5.5], [3.05, 4.45]],
    slots: [
      { box: [-0.55, -3.35, 3.5, 3.45], prefer: 'wedge', joint: [1, 0.62] },
      { box: [-0.42, 1.48, 2.7, 2.6], prefer: 'loop' },
      { box: [2.75, 0.35, 1.5, 2.65], prefer: 'stem' },
      { box: [-2.58, -0.55, 1.47, 2.06], prefer: 'diagonal', joint: [4, 0.86] },
      { box: [-1.17, 3.66, 4.1, 0.85], prefer: 'bar', joint: [6, 0.6] },
      { box: [-1.92, 3.84, 1.25, 0.95], prefer: 'bracket' },
    ],
    accent: [-0.24, -6.64, 1.48, 0.8],
    extraSlots: [
      { box: [3.25, -3.7, 2.25, 2.05], joint: [0, 0] },
      { box: [3.85, 3.82, 2.16, 1.74], joint: [9, 0.92] },
      { box: [-0.5, -0.18, 1.6, 1.48] },
    ],
  },
  wedge: {
    outline: [[-4.95, 5.72], [-0.08, -6], [4.65, 5.72]],
    slots: [
      { box: [-0.85, 0.05, 0.72, 4.7], prefer: 'stem' },
      { box: [-0.13, 1.32, 5.89, 0.63], prefer: 'bar', joint: [0, 0.375] },
      { box: [0.94, 3.05, 2.22, 2.08], prefer: 'arc' },
      { box: [-2.12, 3.23, 1.65, 1.55], prefer: 'diagonal' },
      { box: [0.69, -0.77, 1.13, 1.61], prefer: 'loop' },
      { box: [0.78, 4.61, 1.94, 0.65], prefer: 'bracket' },
    ],
    accent: [0.22, -6.79, 1.38, 0.78],
    extraSlots: [
      { box: [-2.79, -2.38, 2.35, 2.35], joint: [0, 0.71] },
      { box: [2.68, -2.65, 2.48, 1.96], joint: [1, 0.29] },
      { box: [0.85, 0, 1.62, 1.58] },
    ],
  },
  bracket: {
    outline: [[3.25, -5.25], [-4.05, -5.25], [-4.05, 5.15], [2.93, 5.15]],
    slots: [
      { box: [-1.27, -2.92, 3.72, 3.44], prefer: 'wedge', joint: [0, 0.6] },
      { box: [-1.72, 1.41, 3.6, 2.86], prefer: 'arc', joint: [1, 0.66] },
      { box: [1.81, -0.82, 1.3, 3.22], prefer: 'stem' },
      { box: [1.64, 2.35, 1.38, 1.32], prefer: 'diagonal' },
      { box: [-1.86, 3.81, 4.44, 0.75], prefer: 'bar', joint: [1, 0.87] },
      { box: [2.14, -3.5, 1.25, 0.76], prefer: 'loop' },
    ],
    accent: [-0.4, -6.17, 1.46, 0.78],
    extraSlots: [
      { box: [3.67, -4.06, 2.2, 2.17], joint: [0, 0] },
      { box: [3.52, 3.96, 2.32, 1.86], joint: [2, 0.96] },
      { box: [-0.67, -0.6, 1.64, 1.38] },
    ],
  },
};

const axes = ['stem', 'bar', 'diagonal'];
const gestures = ['arc', 'wedge', 'bracket', 'loop'];
const silhouettes = ['spine', 'arc', 'wedge', 'bracket'];

const length = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const totalLength = points => points.slice(1).reduce((sum, point, i) => sum + length(points[i], point), 0);
const heading = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);

function bounds(points) {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const left = Math.min(...xs);
  const right = Math.max(...xs);
  const top = Math.min(...ys);
  const bottom = Math.max(...ys);
  return { x: (right + left) / 2, y: (top + bottom) / 2, w: right - left, h: bottom - top };
}

function straightKind(a, b) {
  const dx = Math.abs(a[0] - b[0]);
  const dy = Math.abs(a[1] - b[1]);
  if (dx <= dy * 0.34) return 'stem';
  if (dy <= dx * 0.34) return 'bar';
  return 'diagonal';
}

function turnsAt(points) {
  return points.slice(2).map((c, i) => {
    const delta = heading(points[i + 1], c) - heading(points[i], points[i + 1]);
    return Math.atan2(Math.sin(delta), Math.cos(delta));
  });
}

function describe(glyph) {
  const strongest = new Map();
  const accents = glyph.strokes.filter(stroke => stroke.accent);
  const record = (kind, points, strength = totalLength(points)) => {
    if (strength > (strongest.get(kind)?.strength ?? 0)) strongest.set(kind, { kind, points, strength });
  };

  for (const { points, accent } of glyph.strokes) {
    if (accent || points.length < 2) continue;
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1];
      const b = points[i];
      record(straightKind(a, b), [a, b]);
    }

    const turn = turnsAt(points);
    const sweep = Math.abs(turn.reduce((sum, value) => sum + value, 0));
    const turnTotal = turn.reduce((sum, value) => sum + Math.abs(value), 0);
    const { w, h } = bounds(points);
    if (points.length >= 5 && Math.min(w, h) >= 1.3 && sweep > turnTotal * 0.7) {
      if (length(points[0], points.at(-1)) < Math.max(w, h) * 0.26) {
        record('loop', points, totalLength(points) * 0.79);
      } else if (sweep > 1.45) {
        record('arc', points, totalLength(points) * 0.85);
      }
    }
    if (turnTotal > 2 && sweep < turnTotal * 0.63 && Math.min(w, h) >= 2
      && length(points[0], points.at(-1)) >= Math.max(w, h) * 0.48) {
      const kind = turn.some(value => Math.abs(value) > 1.85) ? 'zigzag' : 'wave';
      record(kind, points);
    }

    // The most distant bend preserves the apex even when the stem is sampled at several points.
    const a = points[0];
    const c = points.at(-1);
    const bend = points.slice(1, -1).reduce((best, point) => {
      const detour = length(a, point) + length(point, c);
      return detour > best.detour ? { point, detour } : best;
    }, { point: null, detour: 0 });
    if (bend.point && w > 1.2 && h > 1.2 && length(a, c) > 2.4) {
      const b = bend.point;
      const short = Math.min(length(a, b), length(b, c));
      const open = Math.abs(turnsAt([a, b, c])[0]);
      if (short >= 1.3 && open > 1.06 && open < 2.57) {
        const kind = open > 1.78 && straightKind(a, b) === 'diagonal' && straightKind(b, c) === 'diagonal'
          ? 'wedge'
          : 'bracket';
        record(kind, [a, b, c], bend.detour * 0.7);
      }
    }
  }
  return { strongest, accents };
}

function fit(points, [x, y, w, h]) {
  const box = bounds(points);
  const scale = Math.min(w / (box.w || 0.01), h / (box.h || 0.01), 1.6);
  return points.map(([px, py]) => [x + (px - box.x) * scale, y + (py - box.y) * scale]);
}

function featureForFrame(glyph, family) {
  const { strongest } = glyph;
  if (family === 'spine') {
    return strongest.get('stem') ?? [...strongest.values()].find(feature => axes.includes(feature.kind));
  }
  if (family === 'arc') return strongest.get('arc') ?? strongest.get('loop');
  return strongest.get(family);
}

function planFrame(profiles, random, variant, useLetterLayout) {
  const choices = silhouettes.map(family => {
    const donors = profiles.flatMap((profile, source) => {
      const feature = featureForFrame(profile, family);
      return feature ? [{ source, feature }] : [];
    });
    // A steep diagonal may serve as a stem, but favor a true upright when
    // several letters offer one. Otherwise W can displace the L/E/F spine.
    const score = ({ feature }) => {
      if (!useLetterLayout || feature.kind !== 'stem') return feature.strength;
      const [a, b] = feature.points;
      return feature.strength - Math.abs(b[0] - a[0]);
    };
    // Prefer legible long strokes, while giving comparable donors a chance
    // to define the silhouette. Sample once per candidate, never in sort().
    const weights = new Map(donors.map(donor => [donor, score(donor) * (0.72 + random() * 0.56)]));
    donors.sort((a, b) => weights.get(b) - weights.get(a));
    return { family, donors };
  }).filter(({ donors }) => donors.length);
  if (useLetterLayout) {
    const support = ({ donors }) => donors.filter(({ feature }) => (
      feature.kind === donors[0].feature.kind && feature.strength >= donors[0].feature.strength * 0.6
    )).length;
    const weights = new Map(choices.map(choice => [
      choice, Math.sqrt(support(choice)) * (0.55 + random()),
    ]));
    return choices.sort((a, b) => weights.get(b) - weights.get(a))[0];
  }
  const first = Math.floor(random() * choices.length);
  return choices[(first + variant) % choices.length];
}

function gestureKinds(profiles, detail, random) {
  const priority = gestures.map(kind => ({
    kind,
    score: profiles.reduce((sum, { strongest }) => sum + (strongest.get(kind)?.strength ?? 0), 0)
      + random() * 1.3,
  }));
  priority.sort((a, b) => b.score - a.score);
  return priority.slice(0, 1 + Math.round(detail * 2)).map(({ kind }) => kind);
}

function selectGroups(profiles, family, donors, detail, random) {
  const { source: lead, feature: leadFeature } = donors[0];
  const outlineSources = [lead];
  const allowedGestures = gestureKinds(profiles, detail, random);
  const groups = new Map();

  profiles.forEach(({ strongest }, source) => {
    if (source === lead) return;
    const options = [...strongest.values()]
      .filter(feature => axes.includes(feature.kind) || allowedGestures.includes(feature.kind))
      .sort((a, b) => b.strength - a.strength);
    const compatible = featureForFrame(profiles[source], family);
    const strongestOption = options[0];

    if (compatible && compatible.kind === leadFeature.kind && compatible.strength >= strongestOption.strength * 0.88) {
      outlineSources.push(source);
      return;
    }

    const { kind } = strongestOption;
    if (!groups.has(kind)) groups.set(kind, []);
    groups.get(kind).push({ source, feature: strongestOption });
  });

  // A secondary stroke can also carry a different component of the frame donor.
  for (const [kind, contributors] of groups) {
    const feature = profiles[lead].strongest.get(kind);
    if (kind !== leadFeature.kind && feature && feature.strength >= contributors[0].feature.strength * 0.5) {
      contributors.push({ source: lead, feature });
    }
  }
  return { outlineSources, groups };
}

function assignSlots(slots, groups) {
  const placement = [];
  const spare = [];
  for (const slot of slots) {
    if (groups.has(slot.prefer)) {
      placement.push({ slot, contributors: groups.get(slot.prefer) });
      groups.delete(slot.prefer);
    } else {
      spare.push(slot);
    }
  }

  for (const contributors of groups.values()) {
    placement.push({ slot: spare.shift(), contributors });
  }
  return placement;
}

function interpolate(a, b, fraction) {
  return a.map((value, index) => value + (b[index] - value) * fraction);
}

function attach(points, joint, cross) {
  if (cross && points.length === 2) {
    return [
      [points[0][0], joint[1]],
      joint,
      [points[1][0], joint[1]],
    ];
  }
  const contact = points.reduce((closest, point) => (
    length(point, joint) < length(closest, joint) ? point : closest
  ));
  const [dx, dy] = joint.map((value, axis) => value - contact[axis]);
  return points.map(point => length(point, contact) < 0.000001
    ? joint
    : [point[0] + dx * 0.32, point[1] + dy * 0.32]);
}

// Bend an open gesture between two existing pen joints by rotating and
// scaling its whole trace. Its original corners and turns stay intact.
function bridgeGesture(points, outline) {
  if (points.length < 3) return points;
  const a = points[0];
  const b = points.at(-1);
  const span = length(a, b);
  if (span < totalLength(points) * 0.35) return points;
  let best;
  for (const start of outline) {
    for (const end of outline) {
      const scale = length(start, end) / span;
      if (scale < 0.7 || scale > 1.45) continue;
      const turn = heading(start, end) - heading(a, b);
      const cost = length(start, a) + length(end, b) + 2 * (1 - Math.cos(turn));
      if (!best || cost < best.cost) best = { start, end, scale, turn, cost };
    }
  }
  if (!best) return points;
  const { start, end, scale, turn } = best;
  return points.map(([x, y], i) => {
    if (i === 0) return start;
    if (i === points.length - 1) return end;
    const dx = (x - a[0]) * scale;
    const dy = (y - a[1]) * scale;
    return [start[0] + dx * Math.cos(turn) - dy * Math.sin(turn),
      start[1] + dx * Math.sin(turn) + dy * Math.cos(turn)];
  });
}

function withJoints(outline, joints) {
  return outline.flatMap((point, i) => [
    point,
    ...(joints.get(i) ?? []).sort((a, b) => a.fraction - b.fraction).map(({ point }) => point),
  ]);
}

function nearestJoint(points, outline) {
  let bestDistance = Infinity;
  let best;
  for (let i = 0; i < outline.length - 1; i++) {
    const [x, y] = outline[i];
    const dx = outline[i + 1][0] - x;
    const dy = outline[i + 1][1] - y;
    for (const point of points) {
      const fraction = Math.max(0, Math.min(1,
        ((point[0] - x) * dx + (point[1] - y) * dy) / (dx * dx + dy * dy)));
      const gap = length(point, interpolate(outline[i], outline[i + 1], fraction));
      if (gap < bestDistance) {
        bestDistance = gap;
        best = [i, fraction];
      }
    }
  }
  return best;
}

function attachToOutline(points, slot, outline, joints, preserveShape = false) {
  const [segment, fraction] = slot.joint ?? nearestJoint(points, outline);
  const point = interpolate(outline[segment], outline[segment + 1], fraction);
  if (fraction > 0 && fraction < 1) {
    if (!joints.has(segment)) joints.set(segment, []);
    joints.get(segment).push({ fraction, point });
  }
  if (preserveShape) {
    const contact = points.reduce((a, b) => length(a, point) <= length(b, point) ? a : b);
    return points.map(([x, y]) => [point[0] + (x - contact[0]), point[1] + (y - contact[1])]);
  }
  return attach(points, point, slot.cross);
}

function extraStrokes(profiles, occupiedKinds, slots, detail, available) {
  // More letters can share the same outline without losing their distinctive turns.
  const count = Math.min(available, slots.length, Math.ceil(detail * 6));
  if (count <= 0) return [];

  const motifs = ['wave', 'zigzag', 'loop'].flatMap((kind, index) => {
    if (occupiedKinds.has(kind)) return [];
    let best;
    profiles.forEach(({ strongest }, source) => {
      const feature = strongest.get(kind);
      if (feature && (!best || feature.strength > best.feature.strength)) best = { feature, source };
    });
    return best ? [{ ...best, slot: slots[index] }] : [];
  });
  if (count === 2) motifs.sort((a, b) => Number(a.feature.kind === 'zigzag') - Number(b.feature.kind === 'zigzag'));
  return motifs.slice(0, count).map(({ feature, source, slot }) => ({
    slot,
    points: fit(feature.points, slot.box),
    width: 7.4,
    sources: [source],
  }));
}

// Use the donor's actual pen trace, including the strokes on either side of the
// shared segment. Distribute joints by distance along that trace.
function letterLayout(glyph, feature, variant, random) {
  const trace = glyph.strokes.find(({ points }) => feature.points.every(p => points.includes(p))).points;
  const outline = fit(trace, [0, 0, 9, 10]);
  const spans = outline.slice(1).map((p, i) => length(outline[i], p));
  const perimeter = totalLength(outline);
  function slotAt(position, index, prefer) {
    let remaining = Math.max(0.04, Math.min(0.96, position + (random() - 0.5) * 0.24)) * perimeter;
    let segment = 0;
    while (segment < spans.length - 1 && remaining > spans[segment]) {
      remaining -= spans[segment++];
    }
    const fraction = remaining / (spans[segment] || 1);
    const a = outline[segment];
    const b = outline[segment + 1];
    const [x, y] = interpolate(a, b, fraction);
    const side = (index + variant + Math.floor(random() * 2)) % 2 ? 1 : -1;
    const offset = side * 1.7 / (spans[segment] || 1);
    return {
      prefer, joint: [segment, fraction],
      box: [x - (b[1] - a[1]) * offset, y + (b[0] - a[0]) * offset, 3.4 + random() * 2.2, 3.4 + random() * 2.2],
    };
  }
  const kinds = [...axes, ...gestures];
  return {
    outline, accent: [0, bounds(outline).y - bounds(outline).h / 2 - 1, 2, 1],
    slots: kinds.map((kind, i) => slotAt((i + 0.5) / kinds.length, i, kind)),
    extraSlots: [0.17, 0.83, 0.49].map((fraction, i) => slotAt(fraction, i)),
  };
}

// Interlocked study: the upright closes the bowl and the foot carries both
// low points of W. Draw each shared span once so the junctions stay fine.
function interlockedStudy(glyphs, detail, random) {
  const letters = glyphs.map(glyph => glyph.letter);
  const sources = alphabet => letters.flatMap((letter, i) => alphabet.includes(letter) ? [i] : []);
  if (letters.join('') !== 'LETSIFWORK') return null;

  const height = 10;
  const waist = 4.8 + random() * 0.8;
  const crown = 1.1;
  const reach = 5.7 + random() * 0.7;
  const shoulder = [reach * 0.85, waist * 0.66];
  const stroke = (points, alphabet, width = 8) => ({ points, sources: sources(alphabet), width });
  const strokes = [
    stroke([[0, 0], [0, crown], [0, waist], [0, height], [reach * 0.68, height], [reach, height]], 'LETIFROK', 10),
    stroke([[0, crown], [reach * 0.34, crown - 0.3], [reach * 0.7, crown - 0.15],
      [reach * 0.91, crown + 0.6], shoulder, [reach * 0.66, waist - 0.5],
      [reach * 0.34, waist], [0, waist]], 'OR'),
    stroke([[-reach * 0.42, waist - 0.5], [0, height], [reach * 0.32, waist + 0.45],
      [reach * 0.68, height], [reach, waist]], 'WK'),
  ];
  if (sources('TEFI').length) strokes.push(stroke([[-reach * 0.42, crown], [0, crown], [reach, crown]], 'TEFI'));
  if (sources('EF').length) strokes.push(stroke([[reach * 0.34, waist], [reach, waist]], 'EF'));
  if (letters.includes('S')) {
    const points = glyphs[letters.indexOf('S')].strokes[0].points;
    const fitted = fit(points, [0, 0, reach * 0.58, 3.3 + detail]);
    strokes.push(stroke(fitted.map(([x, y]) => [
      shoulder[0] + x - fitted[0][0], shoulder[1] + y - fitted[0][1],
    ]), 'S', 7));
  }
  return strokes;
}

// Compare pen movement by distance along the line, independent of point density.
function contourSamples(points) {
  const span = totalLength(points);
  if (!span) return [];
  const result = [];
  let segment = 0;
  let traveled = 0;
  for (let step = 0; step <= 6; step++) {
    const target = span * step / 6;
    while (segment < points.length - 2 && traveled + length(points[segment], points[segment + 1]) < target) {
      traveled += length(points[segment], points[segment + 1]);
      segment++;
    }
    const a = points[segment];
    const b = points[segment + 1];
    const point = interpolate(a, b, (target - traveled) / (length(a, b) || 1));
    result.push(point.map((value, axis) => (value - points[0][axis]) / span));
  }
  return result;
}

function sharesContour(points, host) {
  const span = totalLength(points);
  const signatures = [contourSamples(points), contourSamples([...points].reverse())];
  for (let start = 0; start < host.length - 1; start++) {
    for (let end = start + 1; end < host.length; end++) {
      const section = host.slice(start, end + 1);
      const ratio = totalLength(section) / span;
      if (ratio < 0.55 || ratio > 3) continue;
      const samples = contourSamples(section);
      if (samples.length && signatures.some(signature => signature.length
        && samples.every((point, i) => length(point, signature[i]) < 0.16))) return true;
    }
  }
  return false;
}

function shareInk(strokes) {
  const retained = [strokes[0]];
  // Reserve the more expressive gestures first. A side of a bowl or a zigzag
  // can then take over a simpler pen movement elsewhere in the composition.
  const branches = strokes.slice(1).sort((a, b) => b.points.length - a.points.length);
  for (const stroke of branches) {
    const host = stroke.width > 6.1 && retained.find(other => other.width > 6.1
      && sharesContour(stroke.points, other.points));
    if (host) host.sources = [...new Set([...host.sources, ...stroke.sources])];
    else retained.push(stroke);
  }
  return strokes.filter(stroke => retained.includes(stroke));
}

export function planComposition(glyphs, detail, variant, random) {
  const study = variant === 0 && interlockedStudy(glyphs, detail, random);
  if (study) return study;
  const profiles = glyphs.map(describe);
  const useLetterLayout = glyphs.every(({ letter }) => /^\p{Script=Latin}/u.test(letter));
  const { family, donors } = planFrame(profiles, random, variant, useLetterLayout);
  const { outline, slots, accent, extraSlots } = useLetterLayout
    ? letterLayout(glyphs[donors[0].source], donors[0].feature, variant, random)
    : frames[family];
  const { outlineSources, groups } = selectGroups(profiles, family, donors, detail, random);
  const mirror = random() < 0.5 ? -1 : 1;
  const { w, h } = bounds(donors[0].feature.points);
  const proportion = w / (w + h);
  const width = 0.86 + proportion * 0.23 + random() * 0.13;
  const strokes = [{ points: outline, width: 14.2, sources: outlineSources }];
  const placement = assignSlots(slots, groups);
  const joints = new Map();
  const occupiedKinds = new Set();

  for (const { slot, contributors } of placement) {
    const strongest = contributors.reduce((best, next) => (
      next.feature.strength > best.feature.strength ? next : best
    ));
    occupiedKinds.add(strongest.feature.kind);
    let points = fit(strongest.feature.points, slot.box);
    const anchor = slot.prefer === strongest.feature.kind ? slot : {};
    points = attachToOutline(points, anchor, outline, joints, useLetterLayout);
    strokes.push({
      points,
      width: axes.includes(strongest.feature.kind) ? 8.9 : 9.5,
      sources: strongest.feature.kind === 'bar'
        ? profiles.flatMap(({ strongest: features }, source) => features.has('bar') ? [source] : [])
        : contributors.map(({ source }) => source),
    });
  }

  const bars = profiles.flatMap(({ strongest }, source) =>
    strongest.has('bar') && strongest.get('bar').strength >= 4 ? [source] : []);
  if (useLetterLayout && bars.length >= 2 && !occupiedKinds.has('bar') && placement.length < slots.length) {
    const slot = slots.find(candidate => candidate.prefer === 'bar');
    const points = fit(profiles[bars[0]].strongest.get('bar').points, slot.box);
    strokes.push({ points: attachToOutline(points, slot, outline, joints, true), sources: bars, width: 8 });
    occupiedKinds.add('bar');
  }
  const accents = profiles.flatMap(({ accents }, source) => accents.map(stroke => ({ ...stroke, source })));
  if (accents.length) {
    const selected = accents.slice(0, detail > 0.65 ? 3 : 2);
    for (const [index, stroke] of selected.entries()) {
      const box = [accent[0] + index * 0.72, accent[1], accent[2] / selected.length, accent[3]];
      strokes.push({ points: fit(stroke.points, box), width: 6.1, sources: [stroke.source] });
    }
  }

  if (detail > 0.65 && !accents.length && placement.length <= slots.length - 2) {
    const used = new Set(placement.map(({ slot }) => slot));
    const donor = donors[0];
    const extra = [...profiles[donor.source].strongest.values()].find(feature => (
      feature.kind !== donor.feature.kind && !placement.some(({ contributors }) => contributors[0].feature.kind === feature.kind)
      && (axes.includes(feature.kind) || gestures.includes(feature.kind))
    ));
    const spare = extra && slots.find(slot => !used.has(slot) && slot.prefer === extra.kind);
    if (spare) {
      occupiedKinds.add(extra.kind);
      strokes.push({ points: attachToOutline(fit(extra.points, spare.box), spare, outline, joints), width: 6.4, sources: [donor.source] });
    }
  }

  for (const { slot, ...stroke } of extraStrokes(profiles, occupiedKinds, extraSlots, detail, 10 - strokes.length)) {
    stroke.points = attachToOutline(stroke.points, slot, outline, joints, true);
    if (useLetterLayout) {
      stroke.points = bridgeGesture(stroke.points, withJoints(outline, joints));
    }
    strokes.push(stroke);
  }
  strokes[0].points = withJoints(outline, joints);
  const drawing = useLetterLayout ? shareInk(strokes) : strokes;
  return drawing.map(stroke => ({
    ...stroke, points: stroke.points.map(([x, y]) => [x * mirror * width, y]),
  }));
}
