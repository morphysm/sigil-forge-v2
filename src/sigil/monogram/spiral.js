// Place complete centerline glyphs along an expanding spiral. Keep the page
// upright as the path turns so characters on the lower arc remain readable.
export function spiralStrokes(glyphs, random) {
  let angle = -Math.PI / 2 + (random() - 0.5) * 0.55;
  let radius = 6;
  const pitch = 12 + random() * 2;
  const width = 8 / Math.sqrt(1 + glyphs.length / 6);
  const drawing = [];
  let previous = [];
  for (const [source, glyph] of glyphs.entries()) {
    const tilt = Math.cos(angle) * 0.22;
    const center = [radius * Math.cos(angle), radius * Math.sin(angle)];
    const strokes = glyph.strokes.map(({ points, accent }) => ({
      points: points.map(([x, y]) => [
        center[0] + (x - 5) * Math.cos(tilt) - (y - 5) * Math.sin(tilt),
        center[1] + (x - 5) * Math.sin(tilt) + (y - 5) * Math.cos(tilt),
      ]),
      width: accent ? width * 0.85 : width,
      sources: [source],
      accent,
    }));
    const anchors = strokes.filter(stroke => !stroke.accent).flatMap(stroke => stroke.points);
    if (previous.length) {
      let closest = Infinity;
      let joint;
      for (const a of previous) {
        for (const b of anchors) {
          const gap = Math.hypot(b[0] - a[0], b[1] - a[1]);
          if (gap < closest) {
            closest = gap;
            joint = [a, b];
          }
        }
      }
      if (closest > 0 && joint) drawing.push({ points: joint, width: width * 0.8, sources: [source - 1, source] });
    }
    drawing.push(...strokes);
    previous = anchors;
    const advance = 2 * Math.asin(Math.min(0.88, 6 / radius));
    angle += advance;
    radius += pitch * advance / (2 * Math.PI);
  }
  return drawing;
}
