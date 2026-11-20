function stickPlate(slug, numeral) {
  const base = `tarot/pilot/${slug}-sticks`;
  return { numeral, small: `${base}-420.webp`, src: `${base}-600.webp`, width: 600, height: 900 };
}

// IDs are the original resonance numbers and persist across editions.
export const cards = [
  { id: 0, audio: 'sounds/static-void-hum.mp3', illustration: stickPlate('fool-variant', '0') },
  { id: 1, audio: 'sounds/tesla-coil-crackle.mp3', illustration: stickPlate('magician', 'I') },
  { id: 2, audio: 'sounds/black-lodge-hum.mp3', illustration: stickPlate('high-priestess', 'II') },
  { id: 3, audio: 'sounds/womb-heartbeat-hum.mp3', illustration: stickPlate('empress', 'III') },
  { id: 4, audio: 'sounds/machine-grid-hum.mp3', illustration: stickPlate('emperor', 'IV') },
  { id: 5, audio: 'sounds/cathode-ray-hum.mp3', illustration: stickPlate('hierophant', 'V') },
  { id: 6, audio: 'sounds/mirror-feedback-whine.mp3', illustration: stickPlate('lovers', 'VI') },
  { id: 7, audio: 'sounds/doppler-engine-hum.mp3', illustration: stickPlate('chariot', 'VII') },
  { id: 8, audio: 'sounds/synapse-firing-crackle.mp3', illustration: stickPlate('strength-variant', 'VIII') },
  { id: 9, audio: 'sounds/single-bulb-hum.mp3', illustration: stickPlate('hermit', 'IX') },
  { id: 10, audio: 'sounds/loop-tape-hiss.mp3', illustration: stickPlate('wheel-of-fortune', 'X') },
  { id: 11, audio: 'sounds/balance-tone-hum.mp3', illustration: stickPlate('justice-variant', 'XI') },
  { id: 12, audio: 'sounds/reverse-frequency.mp3', illustration: stickPlate('hanged-man', 'XII') },
  { id: 13, audio: 'sounds/flatline-dissolve.mp3', illustration: stickPlate('death', 'XIII') },
  { id: 14, audio: 'sounds/phase-shift-hum.mp3', illustration: stickPlate('temperance', 'XIV') },
  { id: 15, audio: 'sounds/pleasure-pulse-hum.mp3', illustration: stickPlate('devil', 'XV') },
  { id: 16, audio: 'sounds/power-surge-crash.mp3', illustration: stickPlate('tower', 'XVI') },
  { id: 17, audio: 'sounds/signal-beacon-hum.mp3', illustration: stickPlate('star', 'XVII') },
  { id: 18, audio: 'sounds/night-frequency-hum.mp3', illustration: stickPlate('moon', 'XVIII') },
  { id: 19, audio: 'sounds/solar-drone.mp3', illustration: stickPlate('sun', 'XIX') },
  { id: 20, audio: 'sounds/trumpet-frequency.mp3', illustration: stickPlate('judgement', 'XX') },
  { id: 21, audio: 'sounds/network-hum-loop.mp3', illustration: stickPlate('world', 'XXI') },
];

export function getCard(id) {
  return cards.find(card => card.id === id);
}
