import { act } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { getInterface, getReading } from './i18n/catalogs';
import { getCard } from './tarot/cards';

const png = 'data:image/png;base64,UE5H';
const audioConstructor = window.Audio;
const originalBase = process.env.PUBLIC_URL;
let root;
let container;
let audio;
let download;
let cardContext;

function click(label) {
  const button = [...container.querySelectorAll('button')].find(
    element => [...element.childNodes]
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent)
      .join('')
      .trim() === label,
  );
  expect(button).toBeDefined();
  act(() => button.click());
}

function typeIntent(intent) {
  const textarea = container.querySelector('#intent');
  const setValue = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
  act(() => {
    setValue.call(textarea, intent);
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

function choose(id, value) {
  const select = container.querySelector(id);
  act(() => {
    select.value = value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  process.env.PUBLIC_URL = '/sigil-forge/';
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  audio = {
    play: jest.fn().mockResolvedValue(undefined),
    pause: jest.fn(),
    currentTime: 0,
  };
  window.Audio = jest.fn(() => audio);
  const sigilContext = {
    fillRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
  };
  cardContext = { fillRect: jest.fn(), clearRect: jest.fn() };
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function () {
    return this.width === 64 ? cardContext : sigilContext;
  });
  jest.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue(png);
  download = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  act(() => root.render(<App />));
});

afterEach(() => {
  if (root) act(() => root.unmount());
  container.remove();
  jest.restoreAllMocks();
  window.Audio = audioConstructor;
  if (originalBase === undefined) delete process.env.PUBLIC_URL;
  else process.env.PUBLIC_URL = originalBase;
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test('Legacy preserves reduction, PNG download, reading, card art, audio and purge', () => {
  choose('#input-mode', 'unicode');
  typeIntent('ab c a b c');
  click('[ EXECUTE.REDUCTION ]');
  expect(container.querySelector('.sf-letters-display').textContent).toBe('ABC');

  click('[ FORGE SIGIL ]');
  expect(container.querySelector('[alt="sigil"]').src).toBe(png);
  expect(container.querySelector('.sf-header-logo').getAttribute('src')).toBe('/sigil-forge/logo.jpg');
  click('[ DOWNLOAD ]');
  expect(download.mock.instances[0].href).toBe(png);
  expect(download.mock.instances[0].download).toBe('sigil.png');

  click('[ ANALYZE.RESONANCE ]');
  expect(container.querySelector('h2').textContent).toBe('6. THE LOVERS');
  expect(container.querySelector('h3').textContent).toBe('THE PHENOMENAL SELF-MODEL');
  expect(container.querySelector('.sf-resonance-text').textContent)
    .toBe('"THE FALSE TWIN STARING BACK. DESTROY THE PHANTOM TO FIND THE VOID THAT BIRTHS YOU."');
  expect(cardContext.clearRect).toHaveBeenCalledWith(0, 0, 64, 64);
  expect(cardContext.fillRect).toHaveBeenCalledWith(0, 0, 64, 1);
  expect(window.Audio).toHaveBeenCalledWith('/sigil-forge/sounds/mirror-feedback-whine.mp3');
  expect(audio.play).toHaveBeenCalledTimes(1);
  expect(audio.volume).toBe(0.5);

  audio.currentTime = 0.5;
  click('[ RETURN TO VOID ]');
  expect(audio.pause).toHaveBeenCalledTimes(1);
  expect(audio.currentTime).toBe(0);
  expect(container.querySelector('#intent').value).toBe('');
  expect(container.querySelector('#input-mode').value).toBe('unicode');
});

test.each([
  ['ja', '表示言語', '意図を入力_'],
  ['ru', 'Язык интерфейса', 'ВВЕДИТЕ_НАМЕРЕНИЕ_'],
  ['is', 'Tungumál viðmóts', 'SLÁÐU_INN_ÆTLUN_'],
])('the interface switches to %s', (locale, label, placeholder) => {
  choose('#interface-language', locale);
  expect(document.documentElement.lang).toBe(locale);
  expect(container.querySelector('label[for="interface-language"]').textContent).toBe(label);
  expect(container.querySelector('#intent').placeholder).toBe(placeholder);
  expect(container.querySelector('[role="status"]')).toBeNull();
});

test.each([
  ['日本語', '日本語', '11. СПРАВЕДЛИВОСТЬ', '11. 正義'],
  ['Привет', 'ПРИВЕТ', '5. ИЕРОФАНТ', '5. 法王'],
  ['Þór', 'ÞÓR', '12. ПОВЕШЕННЫЙ', '12. 吊るされた男'],
])('Unicode input %s stays independent of the interface locale', (intent, letters, russianTitle, japaneseTitle) => {
  choose('#input-mode', 'unicode');
  choose('#interface-language', 'ru');
  const { messages } = getInterface('ru');
  typeIntent(intent);
  click(messages.execute);
  expect(container.querySelector('.sf-letters-display').textContent).toBe(letters);
  click(messages.forge);
  click(messages.analyze);
  expect(container.querySelector('h2').textContent).toBe(russianTitle);
  expect(container.querySelector('.sf-resonance-card').lang).toBe('ru');
  expect(container.textContent).not.toContain(messages.tarotFallback);

  choose('#interface-language', 'ja');

  expect(container.querySelector('h2').textContent).toBe(japaneseTitle);
  expect(container.querySelector('.sf-resonance-card').lang).toBe('ja');
  expect(audio.play).toHaveBeenCalledTimes(1);
});

test('blank and letterless input show validation, and cancel and forge new clear intent', () => {
  choose('#input-mode', 'unicode');
  click('[ EXECUTE.REDUCTION ]');
  expect(container.querySelector('[role="alert"]').textContent).toMatch(/statement of intent/);
  typeIntent('123!?');
  click('[ EXECUTE.REDUCTION ]');
  expect(container.querySelector('[role="alert"]').textContent).toMatch(/contains letters/);

  typeIntent('V');
  click('[ EXECUTE.REDUCTION ]');
  click('CANCEL');
  expect(container.querySelector('#intent').value).toBe('');
  typeIntent('V');
  click('[ EXECUTE.REDUCTION ]');
  click('[ FORGE SIGIL ]');
  click('[ FORGE NEW ]');
  expect(container.querySelector('#intent').value).toBe('');
  expect(window.Audio).not.toHaveBeenCalled();
});

test('a missing canvas context leaves the reduced intent on screen', () => {
  choose('#input-mode', 'unicode');
  HTMLCanvasElement.prototype.getContext.mockReturnValue(null);
  typeIntent('V');
  click('[ EXECUTE.REDUCTION ]');
  click('[ FORGE SIGIL ]');
  expect(container.querySelector('[role="alert"]').textContent).toMatch(/could not be drawn/);
  expect(container.querySelector('.sf-letters-display').textContent).toBe('V');
});

test('audio failure leaves the card readable and unmount pauses the player', async () => {
  choose('#input-mode', 'unicode');
  audio.play.mockRejectedValue(new Error('Playback denied'));
  typeIntent('V');
  click('[ EXECUTE.REDUCTION ]');
  click('[ FORGE SIGIL ]');
  await act(async () => click('[ ANALYZE.RESONANCE ]'));
  expect(container.querySelector('h2').textContent).toBe('0. THE FOOL');
  expect(container.querySelector('[role="alert"]').textContent).toMatch(/audio could not be played/);
  act(() => root.unmount());
  root = null;
  expect(audio.pause).toHaveBeenCalledTimes(1);
});

test('Spiral lettering switches the visible drawing and restores the original', async () => {
  typeIntent('LETSIAGNRDO');
  await act(async () => click('[ EXECUTE.REDUCTION ]'));
  click('[ FORGE SIGIL ]');
  const paths = () => [...container.querySelectorAll('.monogram__plate path')].map(path => path.getAttribute('d'));
  const original = paths();
  click('Spiral lettering');
  expect(paths()).not.toEqual(original);
  click('Spiral lettering');
  expect(paths()).toEqual(original);
});

test('Monogram forges mixed scripts, replays construction, varies geometry and carries the same card into resonance', async () => {
  typeIntent('AЖÞ日');
  await act(async () => click('[ EXECUTE.REDUCTION ]'));
  expect(container.querySelector('.sf-letters-display').textContent).toBe('AЖÞ日');

  click('[ FORGE SIGIL ]');
  expect(container.querySelector('.monogram__controls input[type="range"]')).toBeNull();
  expect(container.querySelector('.monogram__controls details')).toBeNull();
  const svg = container.querySelector('.monogram__plate svg');
  const paths = () => [...svg.querySelectorAll('path')].map(path => path.getAttribute('d'));
  const original = paths();
  expect(original.length).toBeGreaterThan(1);
  expect(svg.querySelector('.monogram__drawing-stroke')).not.toBeNull();

  jest.useFakeTimers();
  try {
    const visible = () => [...svg.querySelectorAll('path:not([visibility="hidden"])')]
      .map(path => path.getAttribute('d'));
    const nextStroke = () => act(() => jest.advanceTimersToNextTimer());
    click('Reveal construction');
    expect(visible()).toEqual([]);
    nextStroke();
    expect(visible()).toEqual(original.slice(0, 1));
    click('Reveal construction');
    expect(visible()).toEqual([]);
    for (let count = 1; count <= original.length; count++) {
      nextStroke();
      expect(visible()).toEqual(original.slice(0, count));
    }

    click('Reveal construction');
    expect(visible()).toEqual([]);
    click('Generate variation');
    expect(visible()).toEqual(paths());
    expect(jest.getTimerCount()).toBe(0);
  } finally {
    jest.useRealTimers();
  }
  expect(paths()).not.toEqual(original);
  expect(svg.querySelector('.monogram__drawing-stroke')).toBeNull();

  const variation = paths();
  click('Reveal construction');
  click('Focus view');
  expect(container.querySelector('.monogram--focus')).not.toBeNull();
  expect(container.querySelector('.monogram__controls')).toBeNull();
  expect(svg.querySelector('path[visibility="hidden"]')).toBeNull();
  act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })));
  expect(paths()).toEqual(variation);

  choose('#interface-language', 'is');
  const { messages } = getInterface('is');
  expect(paths()).toEqual(variation);
  expect(document.documentElement.lang).toBe('is');
  click(messages.analyze);
  const heading = container.querySelector('h2');
  expect(heading.textContent).toBe('Keisaraynjan');
  expect(heading.closest('[lang]').lang).toBe('is');
  expect(container.querySelector('.illustrated-reading__language-note')).toBeNull();
  expect(window.Audio).toHaveBeenCalledWith('/sigil-forge/sounds/womb-heartbeat-hum.mp3');
  expect(audio.play).toHaveBeenCalledTimes(1);
  click(messages.returnToVoid);
  expect(audio.pause).toHaveBeenCalledTimes(1);
});

test('Monogram identifies unsupported glyphs and leaves the entire intent editable', async () => {
  const input = '日 A Ω';
  typeIntent(input);
  await act(async () => click('[ EXECUTE.REDUCTION ]'));
  expect(container.querySelector('[role="alert"] bdi').textContent).toBe('Ω');
  expect(container.querySelector('#intent').value).toBe(input);
  expect(container.querySelector('.sf-letters-display')).toBeNull();

  choose('#input-mode', 'unicode');
  click('[ EXECUTE.REDUCTION ]');
  expect(container.querySelector('.sf-letters-display').textContent).toBe('日AΩ');
});

test('Monogram reports an oversized input without truncating it', async () => {
  const input = '日本語'.repeat(1400);
  typeIntent(input);
  await act(async () => click('[ EXECUTE.REDUCTION ]'));
  expect(container.querySelector('[role="alert"]').textContent).toMatch(/4,096/);
  expect(container.querySelector('#intent').value).toBe(input);
});

test.each(['ja', 'ru', 'is'].flatMap(locale => (
  Array.from('VABCDEFGHIJKLMNOPQRSTU', (letter, id) => [locale, letter, id])
)))(
  'Monogram in %s displays outcome %s as illustrated card %i, with the original reading and sound control',
  async (locale, intent, id) => {
    const card = getCard(id);
    const expanded = getReading(locale, id, 'expanded');
    const original = getReading(locale, id);
    const { messages } = getInterface(locale);
    choose('#interface-language', locale);
    typeIntent(intent);
    await act(async () => click(messages.execute));
    click(messages.forge);
    click(messages.analyze);

    const reading = container.querySelector('.illustrated-reading');
    const heading = reading.querySelector('h2');
    const art = reading.querySelector('img');
    expect(heading.textContent).toBe(expanded.name);
    expect(heading.closest('[lang]').lang).toBe(locale);
    expect(document.activeElement).toBe(heading);
    expect(art.getAttribute('src')).toBe(`/sigil-forge/${card.illustration.src}`);
    expect(art.getAttribute('srcset')).toContain(`/sigil-forge/${card.illustration.small} 420w`);
    expect(art.alt).toBe(expanded.artAlt);
    expect(reading.querySelectorAll('dd')).toHaveLength(3);
    expect(reading.querySelector('.illustrated-reading__language-note')).toBeNull();
    expect(reading.querySelector('details summary').textContent).toBe(messages.tarotOriginal);
    expect(reading.querySelector('details p').lang).toBe(locale);
    expect(reading.querySelector('details p').textContent).toBe(original.text);
    expect(window.Audio).toHaveBeenCalledWith(`/sigil-forge/${card.audio}`);
    expect(audio.play).toHaveBeenCalledTimes(1);

    act(() => art.dispatchEvent(new Event('load')));
    expect(art.classList.contains('illustrated-reading__face')).toBe(true);
    click(messages.tarotMuteCue);
    expect(audio.muted).toBe(true);
    expect(reading.querySelector('[aria-pressed]').getAttribute('aria-pressed')).toBe('true');
    click(messages.returnToVoid);
    expect(audio.pause).toHaveBeenCalledTimes(1);
  },
);

test('the illustrated reading stays readable if the card illustration fails', async () => {
  typeIntent('P');
  await act(async () => click('[ EXECUTE.REDUCTION ]'));
  click('[ FORGE SIGIL ]');
  click('[ ANALYZE.RESONANCE ]');
  const art = container.querySelector('.illustrated-reading img');
  act(() => art.dispatchEvent(new Event('error')));
  expect(container.querySelector('.illustrated-reading img')).toBeNull();
  expect(container.querySelector('.illustrated-reading [role="status"]').textContent)
    .toBe('The card illustration could not be loaded.');
  expect(container.querySelector('.illustrated-reading__question').textContent)
    .toBe(getReading('en', 16, 'expanded').question);
});
