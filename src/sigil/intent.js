import { selectCardId } from '../tarot/resonance';
import { reduceLegacyIntent } from './legacy';

export function prepareIntent(intent, inputMode = 'unicode') {
  if (inputMode === 'legacy') {
    const letters = reduceLegacyIntent(intent);
    return letters.length ? { letters, cardId: selectCardId(letters) } : null;
  }

  // Fold full-width ASCII and half-width kana without folding other compatibility forms.
  const normalized = intent
    .replace(/[\uFF01-\uFF5E\uFF66-\uFF9F]+/gu, widthForms => widthForms.normalize('NFKC'))
    .normalize('NFC')
    .toUpperCase()
    .normalize('NFC');
  if (inputMode === 'monogram') {
    const glyphSequence = normalized.match(/[\p{L}〇]\p{M}*/gu) || [];
    if (!glyphSequence.length) return null;
    // The Japanese numeral 〇 can contribute a shape without replacing the Phase 1 reading.
    const selectionSequence = glyphSequence.filter(letter => !letter.startsWith('〇'));
    const sequence = selectionSequence.length ? selectionSequence : glyphSequence;
    return {
      letters: [...new Set(glyphSequence)],
      cardId: selectCardId([...new Set(sequence)], sequence),
      seed: glyphSequence.join(''),
    };
  }

  const sequence = normalized.match(/\p{L}\p{M}*/gu) || [];
  const letters = [...new Set(sequence)];
  return letters.length ? { letters, cardId: selectCardId(letters, sequence) } : null;
}
