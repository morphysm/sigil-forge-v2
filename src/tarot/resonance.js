import { cards } from './cards';

export function selectCardId(uniqueLetters, letterSequence = uniqueLetters) {
  if (uniqueLetters.every(letter => /^[A-Z]$/.test(letter))) {
    const sum = uniqueLetters.reduce((total, letter) => total + letter.charCodeAt(0) - 64, 0);
    return sum % cards.length;
  }

  // Unicode resonance v1 uses 32-bit FNV-1a over the ordered letter sequence in UTF-8.
  let hash = 0x811c9dc5;
  for (const byte of new TextEncoder().encode(letterSequence.join(''))) {
    hash = Math.imul(hash ^ byte, 0x01000193);
  }
  return (hash >>> 0) % cards.length;
}
