import { prepareIntent } from '../intent';
import { MONOGRAM_PAPER, MONOGRAM_PNG_SIZE, monogramPng, monogramSvg } from './export';
import { forgeMonogram, MAX_MONOGRAM_LETTERS, MONOGRAM_SIZE } from './forge';
import japanese from './japanese.json';
import { loadGlyphs, resolveGlyphs } from './glyphs';

function generate(intent, settings) {
  const { letters, seed } = prepareIntent(intent, 'monogram');
  const { glyphs, unsupported } = resolveGlyphs(letters, japanese);
  expect(unsupported).toEqual([]);
  return forgeMonogram(glyphs, { ...settings, seed });
}

function checkPaths(result) {
  expect(result.paths.length).toBeGreaterThan(0);
  for (const { d, width, sources } of result.paths) {
    // Every path is a move followed by one or more lines or cubic commands.
    expect(d).toMatch(/^M\d+(\.\d+)? \d+(\.\d+)?(?:L\d+(\.\d+)? \d+(\.\d+)?|C\d+(\.\d+)?(?: \d+(\.\d+)?){5})+$/);
    const coordinates = d.match(/\d+(?:\.\d+)?/g).map(Number);
    expect(Math.min(...coordinates) - width / 2).toBeGreaterThan(0);
    expect(Math.max(...coordinates) + width / 2).toBeLessThan(MONOGRAM_SIZE);
    expect(new Set(sources).size).toBe(sources.length);
  }
  const ancestry = new Set(result.paths.flatMap(path => path.sources));
  expect([...ancestry].sort((a, b) => a - b)).toEqual(result.letters.map((_, index) => index));
}

test('normalization and a stable seed reproduce every path and source', () => {
  const first = generate('þór ｶﾞ 志', { variant: 2 });
  expect(generate(' ÞO\u0301R ガ 志 ', { variant: 2 })).toEqual(first);
  expect(generate('þór ｶﾞ 志', { variant: 3 }).paths).not.toEqual(first.paths);
  expect(generate('þór ｶﾞ 志', { variant: 3 }).letters).toEqual(first.letters);
  checkPaths(first);
});

test('letter identity and order change construction, with traceable exact shared spans', () => {
  const art = generate('ART');
  expect(generate('ART', { form: NaN, intricacy: Infinity })).toEqual(art);
  expect(generate('ARK').paths).not.toEqual(art.paths);
  expect(generate('TAR').paths).not.toEqual(art.paths);
  expect(generate('AART').paths).not.toEqual(art.paths);
  expect(art.paths.some(({ sources }) => sources.includes(0) && sources.includes(2))).toBe(true);
  checkPaths(art);
});

test('the tiger intention condenses to a small mark with secondary strokes sharing frame joints', () => {
  const intention = 'This my wish to obtain the strength of a tiger';
  const simple = generate(intention, { form: 0, intricacy: 0 });
  const intricate = generate(intention, { form: 0, intricacy: 1 });
  expect(simple.letters).toHaveLength(15);
  expect(simple.paths.length).toBeLessThanOrEqual(6);
  expect(intricate.paths.length).toBeGreaterThan(simple.paths.length);
  checkPaths(simple);
  checkPaths(intricate);

  const [frame, ...fragments] = simple.paths;
  const vertices = ({ d }) => d.slice(1).split('L');
  expect(fragments.some(path => vertices(path).some(point => vertices(frame).includes(point)))).toBe(true);
  expect(fragments.every(({ width }) => width < frame.width)).toBe(true);
});

test('successive tiger variations use distinct source contours', () => {
  const intention = 'This my wish to obtain the strength of a tiger';
  const shapes = [0, 1, 2, 3].map(variant => generate(intention, { form: 0, variant }));
  const significantTurns = ({ paths: [frame] }) => {
    const points = frame.d.slice(1).split('L').map(pair => pair.split(' ').map(Number));
    return points.slice(2).filter(([cx, cy], index) => {
      const [ax, ay] = points[index];
      const [bx, by] = points[index + 1];
      const ab = [bx - ax, by - ay];
      const bc = [cx - bx, cy - by];
      const cross = Math.abs(ab[0] * bc[1] - ab[1] * bc[0]);
      return cross > 0.08 * Math.hypot(...ab) * Math.hypot(...bc);
    }).length;
  };
  const turns = shapes.map(significantTurns).sort((a, b) => a - b);
  expect(new Set(turns).size).toBeGreaterThan(1);
  expect(new Set(shapes.map(shape => shape.paths[0].d)).size).toBe(4);
  shapes.forEach(checkPaths);
});

test('a 19-letter intention retains its wave, zigzag and closed loop across all four frames', () => {
  const intent = 'ISTWORKNGJUCEAFYMBL';
  const vertices = ({ d }) => d.slice(1).split('L');

  for (let variant = 0; variant < 4; variant++) {
    const result = generate(intent, { form: 0, variant });
    const [frame] = result.paths;
    const frameVertices = vertices(frame);
    const attributableTo = (letter, count) => result.paths.find(path => (
      path.sources.includes(result.letters.indexOf(letter)) && vertices(path).length === count
    ));
    const wave = vertices(attributableTo('S', 12));
    const zigzag = vertices(attributableTo('M', 5));
    const loop = vertices(attributableTo('O', 11));

    expect(wave).toHaveLength(12);
    expect(zigzag).toHaveLength(5);
    expect(loop.at(-1)).toBe(loop[0]);
    expect(wave.some(vertex => frameVertices.includes(vertex))).toBe(true);
    expect(zigzag.some(vertex => frameVertices.includes(vertex))).toBe(true);
    expect(result.paths.length).toBeLessThanOrEqual(10);
    checkPaths(result);
  }
});

test('geometric and organic forms have distinct constructions and detail keeps additional strokes', () => {
  const geometric = generate('ÞÐЉ語', { form: 0, intricacy: 1 });
  const organic = generate('ÞÐЉ語', { form: 1, intricacy: 1 });
  expect(geometric.paths.every(path => !path.d.includes('C'))).toBe(true);
  expect(organic.paths.some(path => path.d.includes('C'))).toBe(true);
  expect(organic.paths).not.toEqual(geometric.paths);
  const simple = generate('語', { intricacy: 0 });
  const intricate = generate('語', { intricacy: 1 });
  expect(intricate.paths.length).toBeGreaterThan(simple.paths.length);
  checkPaths(geometric);
  checkPaths(organic);
  checkPaths(simple);
  checkPaths(intricate);
});

test('native glyph processing covers the advertised alphabets, halfwidth kana and Japanese voicing', () => {
  const native = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÐÉÍÓÚÝÞÆÖАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯЄІЇҐЎЈЅЉЊЏ';
  const { glyphs, unsupported } = resolveGlyphs([...native], japanese);
  expect(glyphs).toHaveLength([...native].length);
  expect(unsupported).toEqual([]);
  expect(Object.keys(japanese)).toHaveLength(6543);
  const japaneseIntent = prepareIntent('日本語 ﾊﾟ ｶﾞ か\u3099 𠮷髙〇', 'monogram');
  const { glyphs: japaneseGlyphs } = resolveGlyphs(japaneseIntent.letters, japanese);
  expect(japaneseGlyphs.map(({ letter }) => letter)).toEqual(['日', '本', '語', 'パ', 'ガ', 'が', '𠮷', '髙', '〇']);
  expect(japaneseGlyphs.find(({ letter }) => letter === 'パ').strokes.some(stroke => stroke.accent)).toBe(true);
  expect(japaneseIntent.cardId).toBe(prepareIntent('日本語 ﾊﾟ ｶﾞ か\u3099 𠮷髙').cardId);
  expect(resolveGlyphs(['A', 'Ω', '𰻞'], japanese).unsupported).toEqual(['Ω', '𰻞']);
});

test('Japanese iteration and shorthand signs trigger glyph loading when entered alone', async () => {
  for (const letter of ['〆', '々', '〇', 'ー']) {
    const { letters } = prepareIntent(letter, 'monogram');
    const { glyphs, unsupported } = await loadGlyphs(letters);
    expect(unsupported).toEqual([]);
    expect(glyphs.map(glyph => glyph.letter)).toEqual([letter]);
  }
});

test('dense mixed-script compositions keep geometry bounded across repeated variants', () => {
  const { glyphs } = resolveGlyphs([...'ABCDEFGHIJKLMNOPQRSTÞÆÐÖИЙЁЖ日本語風'], japanese);
  expect(glyphs).toHaveLength(MAX_MONOGRAM_LETTERS);
  expect(forgeMonogram([...glyphs, glyphs[0]])).toBeNull();
  expect(forgeMonogram([])).toBeNull();
  const start = performance.now();
  for (let variant = 0; variant < 8; variant++) {
    const result = forgeMonogram(glyphs, { variant, form: (variant % 2), intricacy: 1 });
    expect(result.paths.length).toBeLessThanOrEqual(10);
    checkPaths(result);
  }
  // A large regression allowance keeps this useful on slower CI machines.
  expect(performance.now() - start).toBeLessThan(4000);
});

test('SVG serializes only finished geometry and optional background', () => {
  const sigil = generate('AЖ日');
  const parser = new DOMParser();
  for (const transparent of [true, false]) {
    const xml = parser.parseFromString(monogramSvg(sigil, transparent), 'image/svg+xml');
    expect(xml.querySelector('parsererror')).toBeNull();
    const svg = xml.documentElement;
    expect(svg.getAttribute('width')).toBe('640');
    expect(svg.getAttribute('height')).toBe('640');
    expect(svg.getAttribute('viewBox')).toBe('0 0 640 640');
    expect(svg.querySelector('rect')?.getAttribute('fill')).toBe(transparent ? undefined : MONOGRAM_PAPER);
    const paths = [...svg.querySelectorAll('path')];
    expect(paths.map(path => path.getAttribute('d'))).toEqual(sigil.paths.map(path => path.d));
    expect(paths.map(path => Number(path.getAttribute('stroke-width')))).toEqual(sigil.paths.map(path => path.width));
    expect(svg.textContent).toBe('');
  }
});

test.each([true, false])('PNG uses the same paths and widths, with transparency %p', async transparent => {
  const sigil = generate('Þ日');
  const path2d = global.Path2D;
  global.Path2D = jest.fn(function (data) { this.data = data; });
  const stroked = [];
  const context = {
    scale: jest.fn(), fillRect: jest.fn(),
    stroke(path) { stroked.push([path.data, this.lineWidth]); },
  };
  const blob = new Blob(['mock'], { type: 'image/png' });
  let encodedCanvas;
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context);
  jest.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(function (callback, type) {
    expect([this.width, this.height, type]).toEqual([MONOGRAM_PNG_SIZE, MONOGRAM_PNG_SIZE, 'image/png']);
    encodedCanvas = this;
    callback(blob);
  });
  try {
    await expect(monogramPng(sigil, transparent)).resolves.toBe(blob);
    expect(context.scale).toHaveBeenCalledWith(MONOGRAM_PNG_SIZE / sigil.size, MONOGRAM_PNG_SIZE / sigil.size);
    expect(context.fillRect).toHaveBeenCalledTimes(transparent ? 0 : 1);
    expect(stroked).toEqual(sigil.paths.map(({ d, width }) => [d, width]));
    expect([encodedCanvas.width, encodedCanvas.height]).toEqual([0, 0]);
  } finally {
    global.Path2D = path2d;
    jest.restoreAllMocks();
  }
});

test('LETSIAGNRDO retains the S turn and closed O with every stroke joined', () => {
  for (let variant = 0; variant < 4; variant++) {
    const result = generate('LETSIAGNRDO', { form: 0, variant });
    const vertices = path => path.d.slice(1).split('L');
    const frame = new Set(vertices(result.paths[0]));
    for (const path of result.paths.slice(1)) {
      expect(vertices(path).some(point => frame.has(point))).toBe(true);
    }
    const from = letter => result.paths.filter(path => path.sources.includes(result.letters.indexOf(letter)));
    expect(from('S').some(path => vertices(path).length >= 12)).toBe(true);
    expect(from('O').some(path => vertices(path)[0] === vertices(path).at(-1))).toBe(true);
    checkPaths(result);
  }
});

test('LETSIFWORK keeps its S curve, W bends and O loop in the alternate frames', () => {
  for (let variant = 1; variant < 4; variant++) {
    const result = generate('LETSIFWORK', { form: 0, variant });
    const vertices = path => path.d.slice(1).split('L');
    const frame = new Set(vertices(result.paths[0]));
    for (const [letter, count] of [['S', 12], ['W', 5], ['O', 11]]) {
      const stroke = result.paths.find(path => path.sources.includes(result.letters.indexOf(letter))
        && vertices(path).length === count);
      expect(stroke).toBeDefined();
      const points = vertices(stroke);
      expect(points.some(point => frame.has(point))).toBe(true);
      if (letter === 'O') expect(points[0]).toBe(points.at(-1));
    }
  }
});

test('the L pen stroke supplies the shared upright and foot of LETSIFWORK', () => {
  const result = generate('LETSIFWORK', { form: 0 });
  const outline = result.paths[0];
  expect(outline.sources.map(i => result.letters[i])).toEqual(expect.arrayContaining(['L', 'E', 'F']));
  const points = outline.d.slice(1).split('L').map(pair => pair.split(' ').map(Number));
  const foot = points.filter(([, y]) => y === points.at(-1)[1]);
  expect(foot.length).toBeGreaterThanOrEqual(2);
  expect(Math.abs(foot[0][0] - foot.at(-1)[0])).toBeGreaterThan(100);
});

test.each(['LETSIFWORK'])('the interlocked %s shares the bowl closure and both W feet', intent => {
  const result = generate(intent, { form: 0 });
  const [spine, bowl, zigzag] = result.paths.map(path => path.d.slice(1).split('L'));
  expect([bowl[0], bowl.at(-1)]).toEqual(spine.slice(1, 3));
  expect([zigzag[1], zigzag[3]]).toEqual(spine.slice(3, 5));
  checkPaths(result);
});

test('related intentions and later variations change the actual pen construction', () => {
  // Ignore coordinates while retaining the order of pen joints on the lead stroke.
  const structure = result => {
    const vertices = d => d.slice(1).split('L');
    const outline = vertices(result.paths[0].d);
    return JSON.stringify(result.paths.map(({ d, sources }) => [
      vertices(d).length, sources.map(index => result.letters[index]).sort().join(''),
      vertices(d).map(point => outline.indexOf(point)),
    ]));
  };
  const sketch = (intent, variant = 0) => generate(intent, { form: 0, variant });
  const words = ['FLOW', 'WOLF', 'FLOWER'];
  expect(new Set(words.map(word => structure(sketch(word)))).size).toBe(3);
  expect(structure(sketch('LETSIFWORK', 4))).not.toEqual(structure(sketch('LETSIFWORK')));
  const sequence = Array.from({ length: 8 }, (_, i) => structure(sketch('FLOWER', i)));
  expect(new Set(sequence).size).toBeGreaterThan(4);
  expect(sketch('FLOWER', 6)).toEqual(sketch('FLOWER', 6));
});

test('FLOW uses three pen strokes with all four letters accounted for', () => {
  const drawing = generate('FLOW');
  expect(drawing.paths).toHaveLength(3);
  expect(drawing.paths.some(({ sources }) => sources.length >= 2)).toBe(true);
  checkPaths(drawing);
});
