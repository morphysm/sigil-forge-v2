import { prepareIntent } from './intent';
import { forgeLegacySigil } from './legacy';

describe('Unicode intent', () => {
  test.each([
    ['ab c a b c', ['A', 'B', 'C'], 6],
    ['ＡＢＣ', ['A', 'B', 'C'], 6],
    ['日本語', ['日', '本', '語'], 11],
    ['こんにちは', ['こ', 'ん', 'に', 'ち', 'は'], 5],
    ['Привет', ['П', 'Р', 'И', 'В', 'Е', 'Т'], 5],
    ['ёлка', ['Ё', 'Л', 'К', 'А'], 9],
    ['ÞÓR', ['Þ', 'Ó', 'R'], 12],
    ['AЖB', ['A', 'Ж', 'B'], 6],
    ['𠮷野', ['𠮷', '野'], 10],
    ['ガガ', ['ガ'], 5],
    ['カ\u3099ｶﾞ', ['ガ'], 5],
  ])('preserves letters and produces a stable card for %j', (intent, letters, cardId) => {
    expect(prepareIntent(intent)).toEqual({ letters, cardId });
  });

  test('preserves Icelandic letters and canonical equivalence', () => {
    const precomposed = prepareIntent('áéíóúýþðæö');
    expect(precomposed.letters).toEqual([...'ÁÉÍÓÚÝÞÐÆÖ']);
    expect(prepareIntent('áéíóúýþðæö'.normalize('NFD'))).toEqual(precomposed);
    expect(prepareIntent('ЕЁеё').letters).toEqual(['Е', 'Ё']);
  });

  test('non-ASCII resonance uses the full normalized sequence, before deduplication', () => {
    expect(prepareIntent('AÁA')).toEqual({ letters: ['A', 'Á'], cardId: 13 });
    expect(prepareIntent('AAÁ')).toEqual({ letters: ['A', 'Á'], cardId: 1 });
  });

  test.each(['', ' \u3000 ', '123!?', '🌀', '\u0301'])(
    'rejects an input without letters (%j)',
    intent => expect(prepareIntent(intent)).toBeNull(),
  );
});

describe('original sigil renderer', () => {
  afterEach(() => jest.restoreAllMocks());

  test.each([['X', 4], ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 26]])(
    'draws a 600 × 600 Legacy PNG with the original strokes for %s',
    (core, segments) => {
      const strokes = [];
      const context = {
        fillRect: jest.fn(),
        beginPath: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        stroke() {
          strokes.push([this.strokeStyle, this.lineWidth, this.shadowBlur]);
        },
      };
      const random = jest.fn().mockReturnValue(0.5);
      jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context);
      const serialize = jest.spyOn(HTMLCanvasElement.prototype, 'toDataURL')
        .mockReturnValue('data:image/png;base64,PNG');

      expect(forgeLegacySigil({ letters: [...core] }, random)).toEqual({
        src: 'data:image/png;base64,PNG',
        filename: 'sigil.png',
      });
      expect(serialize.mock.instances[0].width).toBe(600);
      expect(serialize.mock.instances[0].height).toBe(600);
      expect(context.fillRect).toHaveBeenCalledWith(0, 0, 600, 600);
      expect(context.lineTo).toHaveBeenCalledTimes(48 + segments);
      expect(context.moveTo).toHaveBeenLastCalledWith(300, 300);
      expect(context.lineTo).toHaveBeenLastCalledWith(300, 300);
      expect(random).toHaveBeenCalledTimes(2 * (segments + 1));
      expect(strokes.slice(-2)).toEqual([['#c70c0c', 15, 15], ['#fff', 2, 5]]);
    },
  );
});
