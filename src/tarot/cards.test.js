import { existsSync, readFileSync } from 'fs';
import { publicAsset } from '../assets';
import { getInterface, getReading, languages } from '../i18n/catalogs';
import { prepareIntent } from '../sigil/intent';
import { cards, getCard } from './cards';

test('the 22 original Tarot outcomes and assets remain in the documented order', () => {
  expect(cards.map(card => card.id)).toEqual(Array.from({ length: 22 }, (_, id) => id));
  expect(cards.map(({ id, audio }) => ({ id, audio, ...getReading('en', id) }))).toMatchSnapshot();
  expect(new Set(cards.map(card => card.audio)).size).toBe(22);
  cards.forEach(card => expect(existsSync(`public/${card.audio}`)).toBe(true));
  expect(existsSync('public/logo.jpg')).toBe(true);
});

test.each(Array.from('VABCDEFGHIJKLMNOPQRSTU', (letter, id) => [letter, id]))(
  'the original A1Z26 selector maps %s to card %i',
  (letter, id) => {
    expect(prepareIntent(letter, 'legacy').cardId).toBe(id);
    expect(prepareIntent(letter).cardId).toBe(id);
    expect(getCard(id).id).toBe(id);
    expect(getReading('en', id).name).toMatch(new RegExp(`^${id}\\. `));
  },
);

test('all four locales have matching coverage and unrecognized locales fall back to English', () => {
  expect(Object.keys(languages)).toEqual(['en', 'ja', 'ru', 'is']);
  const english = getInterface('en');
  expect(english.language).toBe('en');
  expect(getInterface('unknown')).toEqual(english);
  for (const code of ['ja', 'ru', 'is']) {
    const { language, messages } = getInterface(code);
    expect(language).toBe(code);
    expect(Object.keys(messages).sort()).toEqual(Object.keys(english.messages).sort());
  }
  for (const { id } of cards) {
    for (const edition of ['legacy', 'expanded']) {
      const englishReading = getReading('en', id, edition);
      expect(getReading('unknown', id, edition)).toEqual(englishReading);
      const narrative = edition === 'legacy' ? 'text' : 'archetype';
      for (const code of ['ja', 'ru', 'is']) {
        const translated = getReading(code, id, edition);
        expect(translated.language).toBe(code);
        expect(translated[narrative]).not.toBe(englishReading[narrative]);
      }
    }
  }
});

test('all 22 illustrated outcomes have complete, distinct readings and responsive local artwork', () => {
  const exportedImages = new Set();
  const compositions = new Set();
  const approvedPngs = new Map([
    ['tarot/pilot/fool-variant-sticks-600.webp', 'fool_2.png'],
    ['tarot/pilot/strength-variant-sticks-600.webp', 'strength-variant.png'],
    ['tarot/pilot/justice-variant-sticks-600.webp', 'the_justice.png'],
  ]);
  for (const card of cards) {
    const expanded = getReading('en', card.id, 'expanded');
    expect(expanded).toEqual(expect.objectContaining({ artAlt: expect.any(String), language: 'en' }));
    const { src, small, width, height } = card.illustration;
    expect(width / height).toBe(2 / 3);
    for (const file of [src, small]) {
      expect(existsSync(`public/${file}`)).toBe(true);
      exportedImages.add(file);
    }
    if (approvedPngs.has(src)) {
      const master = readFileSync(`art/tarot/pilot/stick-study/${approvedPngs.get(src)}`);
      expect(master.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
      compositions.add(master.toString('base64'));
      continue;
    }
    const master = src.replace('tarot/pilot/', '').replace('-sticks-600.webp', '.svg');
    const xml = new DOMParser().parseFromString(
      readFileSync(`art/tarot/pilot/stick-study/${master}`, 'utf8'),
      'image/svg+xml',
    );
    const plate = xml.documentElement;
    const [background, ...strokes] = [...plate.children];
    expect(plate.getAttribute('viewBox')).toBe('0 0 240 360');
    expect(background.localName).toBe('rect');
    expect(background.getAttribute('fill')).toBe('#000000');
    expect(strokes.every(stroke => stroke.localName === 'line')).toBe(true);
    expect(new Set(strokes.map(stroke => stroke.getAttribute('stroke'))))
      .toEqual(new Set(['#00FF41', '#F8F4E7']));
    compositions.add(strokes.map(stroke => stroke.outerHTML).join(''));
  }
  expect(exportedImages.size).toBe(44);
  expect(compositions.size).toBe(22);
});

test.each([
  ['', '/logo.jpg'],
  ['/', '/logo.jpg'],
  ['/sigil-forge', '/sigil-forge/logo.jpg'],
  ['/sigil-forge/', '/sigil-forge/logo.jpg'],
  ['https://cdn.example/sigil-forge/', 'https://cdn.example/sigil-forge/logo.jpg'],
  ['.', './logo.jpg'],
])('resolves assets relative to %j', (base, expected) => {
  expect(publicAsset('logo.jpg', base)).toBe(expected);
  expect(publicAsset('sounds/static-void-hum.mp3', base))
    .toBe(expected.replace('logo.jpg', 'sounds/static-void-hum.mp3'));
});
