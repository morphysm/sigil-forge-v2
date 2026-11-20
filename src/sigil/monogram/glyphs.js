// Centerline templates on a 10-unit grid. A slash starts another pen stroke.
const alphabet = {
  A: '0,10 4,0 5,0 9,10 / 2,6 7,6',
  B: '1,0 1,10 / 1,0 6,0 8,1 8,3 6,5 1,5 / 6,5 9,6 9,8 7,10 1,10',
  C: '9,1 6,0 3,0 1,2 0,5 1,8 3,10 7,10 9,9',
  D: '1,0 1,10 / 1,0 5,0 8,2 9,5 8,8 5,10 1,10',
  E: '1,0 1,10 / 1,0 9,0 / 1,5 7,5 / 1,10 9,10',
  F: '1,10 1,0 / 1,0 9,0 / 1,5 7,5',
  G: '9,1 6,0 3,0 1,2 0,5 1,8 3,10 7,10 9,8 9,5 6,5',
  H: '1,0 1,10 / 9,0 9,10 / 1,5 9,5',
  I: '5,0 5,10 / 2,0 8,0 / 2,10 8,10',
  J: '9,0 9,7 8,9 6,10 3,10 1,8',
  K: '1,0 1,10 / 9,0 1,6 / 4,4 9,10',
  L: '1,0 1,10 9,10',
  M: '0,10 1,0 5,6 9,0 10,10',
  N: '1,10 1,0 9,10 9,0',
  O: '5,0 8,1 10,4 10,6 8,9 5,10 2,9 0,6 0,4 2,1 5,0',
  P: '1,10 1,0 / 1,0 6,0 9,1 9,4 6,5 1,5',
  Q: '5,0 8,1 10,4 10,6 8,9 5,10 2,9 0,6 0,4 2,1 5,0 / 6,7 10,11',
  R: '1,10 1,0 / 1,0 6,0 9,1 9,4 6,5 1,5 / 5,5 10,10',
  S: '9,1 7,0 3,0 1,2 1,3 3,5 7,5 9,7 9,8 7,10 3,10 0,9',
  T: '0,0 10,0 / 5,0 5,10',
  U: '1,0 1,6 2,9 5,10 8,9 9,6 9,0',
  V: '0,0 4,10 5,10 10,0',
  W: '0,0 2,10 5,4 8,10 10,0',
  X: '1,0 9,10 / 9,0 1,10',
  Y: '0,0 5,5 10,0 / 5,5 5,10',
  Z: '0,0 9,0 1,10 10,10',
  Æ: '0,10 4,0 10,0 / 2,6 9,6 / 5,0 5,10 10,10',
  Ð: '2,0 2,10 / 2,0 6,0 9,2 10,5 9,8 6,10 2,10 / 0,5 5,5',
  Þ: '1,0 1,10 / 1,2 6,2 9,3 9,6 6,7 1,7',
  Ø: '5,0 8,1 10,4 10,6 8,9 5,10 2,9 0,6 0,4 2,1 5,0 / 0,10 10,0',
  Œ: '5,0 2,0 0,3 0,7 2,10 5,10 / 10,0 5,0 5,10 10,10 / 5,5 9,5',
  Ł: '1,0 1,10 9,10 / 0,6 6,2',
};

const cyrillic = {
  А: alphabet.A,
  Б: '9,0 1,0 1,10 / 1,5 6,5 9,6 9,9 6,10 1,10',
  В: alphabet.B,
  Г: '1,10 1,0 9,0',
  Д: '1,10 1,8 9,8 9,10 / 2,8 4,0 8,0 8,8',
  Е: alphabet.E,
  Ж: '5,0 5,10 / 0,0 5,5 10,0 / 0,10 5,5 10,10',
  З: '1,1 3,0 7,0 9,2 8,4 5,5 8,6 9,8 7,10 3,10 1,9',
  И: '1,0 1,10 9,0 9,10',
  К: alphabet.K,
  Л: '0,10 4,0 9,0 9,10',
  М: alphabet.M,
  Н: alphabet.H,
  О: alphabet.O,
  П: '1,10 1,0 9,0 9,10',
  Р: alphabet.P,
  С: alphabet.C,
  Т: alphabet.T,
  У: '0,0 5,6 / 9,0 5,7 3,10 1,10',
  Ф: '5,-1 5,11 / 5,1 8,2 10,4 10,6 8,8 5,9 2,8 0,6 0,4 2,2 5,1',
  Х: alphabet.X,
  Ц: '1,0 1,8 8,8 8,0 / 8,8 10,8 10,10',
  Ч: '0,0 0,3 2,5 5,6 9,6 / 9,0 9,10',
  Ш: '0,0 0,10 10,10 10,0 / 5,0 5,10',
  Щ: '0,0 0,8 10,8 10,0 / 5,0 5,8 / 10,8 11,8 11,10',
  Ъ: '0,0 3,0 3,10 / 3,5 7,5 10,6 10,9 7,10 3,10',
  Ы: '0,0 0,10 / 0,5 4,5 7,6 7,9 4,10 0,10 / 10,0 10,10',
  Ь: '1,0 1,10 / 1,5 6,5 9,6 9,9 6,10 1,10',
  Э: '1,1 4,0 7,0 9,2 10,5 9,8 7,10 3,10 1,9 / 5,5 10,5',
  Ю: '0,0 0,10 / 0,5 4,5 / 7,0 9,1 10,4 10,6 9,9 7,10 5,9 4,6 4,4 5,1 7,0',
  Я: '9,10 9,0 / 9,0 4,0 1,1 1,4 4,5 9,5 / 5,5 0,10',
  Є: '9,1 6,0 3,0 1,2 0,5 1,8 3,10 7,10 9,9 / 0,5 6,5',
  І: alphabet.I,
  Ґ: '1,10 1,1 8,1 8,-1',
  Ј: alphabet.J,
  Ѕ: alphabet.S,
  Ђ: '0,2 9,2 / 3,0 3,10 / 3,5 7,5 9,6 9,9 8,11 6,12',
  Ћ: '0,2 9,2 / 3,0 3,10 / 3,5 7,5 9,6 9,10',
  Љ: '0,10 3,0 6,0 6,10 / 6,5 9,5 11,6 11,9 9,10 6,10',
  Њ: '0,0 0,10 / 5,0 5,10 / 0,5 8,5 11,6 11,9 8,10 5,10',
  Џ: '1,0 1,8 9,8 9,0 / 5,8 5,11',
};

const marks = {
  '\u0300': '3,-3 5,-1',
  '\u0301': '5,-1 7,-3',
  '\u0302': '3,-1 5,-3 7,-1',
  '\u0303': '2,-1 4,-2 6,-1 8,-2',
  '\u0304': '3,-2 7,-2',
  '\u0306': '2,-3 3,-1 7,-1 8,-3',
  '\u0307': '5,-2.4 5,-1.6',
  '\u0308': '3,-2.4 3,-1.6 / 7,-2.4 7,-1.6',
  '\u030A': '5,-4 6,-3 5,-2 4,-3 5,-4',
  '\u030B': '3,-1 5,-3 / 6,-1 8,-3',
  '\u030C': '3,-3 5,-1 7,-3',
  '\u0327': '5,10 5,11 7,12 5,13 3,13',
  '\u0328': '6,10 4,12 5,13 7,12',
};

function parseStrokes(template, accent = false) {
  return template.split(' / ').map(stroke => ({
    points: stroke.split(' ').map(point => point.split(',').map(Number)),
    accent,
  }));
}

function japaneseStrokes(encoded) {
  const strokes = encoded.split(' ').map(stroke => (
    stroke.match(/.{4}/g).map(point => [parseInt(point.slice(0, 2), 16), parseInt(point.slice(2), 16)])
  ));
  const points = strokes.flat();
  const left = Math.min(...points.map(([x]) => x));
  const top = Math.min(...points.map(([, y]) => y));
  const width = Math.max(...points.map(([x]) => x)) - left;
  const height = Math.max(...points.map(([, y]) => y)) - top;
  // Keep narrow kana strokes from growing to the weight of a full kanji.
  const scale = 10 / Math.max(width, height, 27);
  return strokes.map(points => ({
    points: points.map(([x, y]) => [(x - left - width / 2) * scale + 5, (y - top - height / 2) * scale + 5]),
    accent: false,
  }));
}

export function isJapaneseLetter(letter) {
  return /^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー〆]/u.test(letter);
}

export function resolveGlyphs(letters, japanese = {}) {
  const glyphs = [];
  const unsupported = [];
  for (const letter of letters) {
    const [base, ...accents] = letter.normalize('NFD');
    const voicing = accents.length === 1 && accents[0];
    if (japanese[base] && (voicing === '\u3099' || voicing === '\u309A')) {
      const mark = voicing === '\u3099'
        ? '8,-0.5 9,1 / 10,-1 11,0.5'
        : '10,-1 11,0 10,1 9,0 10,-1';
      glyphs.push({ letter, strokes: [...japaneseStrokes(japanese[base]), ...parseStrokes(mark, true)] });
      continue;
    }
    if (japanese[letter]) {
      glyphs.push({ letter, strokes: japaneseStrokes(japanese[letter]) });
      continue;
    }

    const template = alphabet[base] || cyrillic[base];
    if (!template || accents.length > 3 || accents.some(accent => !marks[accent])) {
      unsupported.push(letter);
      continue;
    }
    const strokes = parseStrokes(template);
    for (const accent of accents) strokes.push(...parseStrokes(marks[accent], true));
    glyphs.push({ letter, strokes });
  }
  return { glyphs, unsupported };
}

export async function loadGlyphs(letters) {
  if (!letters.some(isJapaneseLetter)) return resolveGlyphs(letters);
  const { default: japanese } = await import('./japanese.json');
  return resolveGlyphs(letters, japanese);
}
