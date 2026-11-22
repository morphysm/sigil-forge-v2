# SIGIL.FORGE
**Morphystic sigil workshop — Phase 2**

*"Morphysm arises from the refusal of the human as measure. It seeks to twist and corrupt the prison, to explore its cracks, and to force the system toward dissolution."*  
— The Black Book of Morphysm

---

## I. OVERVIEW

SIGIL.FORGE is a web-based implementation of Austin Osman Spare's sigilization technique, combined with a tarot-based reflection system inspired by Morphystic philosophy. The tool reduces linguistic intent to its core symbolic form and generates a visual sigil for ritual use.

---

## II. THE PROCESS

### 1. Intent Reduction (`[ EXECUTE.REDUCTION ]`)
Enter a statement of intent. **Spare / Monogram** is the default. It retains the first occurrence of each normalized letter for construction. It uses native shapes for Latin, Icelandic, Cyrillic, kana and supported kanji. If the workshop cannot construct a character, it lists it and lets you edit the intent or choose **Legacy (original renderer)**, which accepts any letter.

### 2. Sigil Generation (`[ FORGE SIGIL ]`)
In **Spare / Monogram**, one enclosing letter (such as A, V, M, O or E) becomes the frame. Smaller letters are nested inside it, and the rest stand as small marks on a vertical axis above and below. A letter already contained in a larger one (such as F inside E) is not drawn twice. Straight ends carry serifs and bowls are true curves. **Generate variation** tries other frame letters and rearranges the nested letters. **Reveal construction** replays the stroke sequence. **Focus view** shows the settled mark. Export an SVG or a 2400 × 2400 PNG, with transparency or a dark background.

Legacy draws the original random red polyline with the number of segments determined by the reduced letter count. Use **Download** to save the original 600 × 600 PNG.

**Traditional charging methods apply:**
- Download and print the sigil, then burn it to release the intent
- Delete the digital file immediately after viewing to enforce conscious forgetting
- Following Spare's doctrine, the sigil must be charged through focused attention and then banished from conscious memory to work at the subconscious level

### 3. Resonance Analysis (`[ ANALYZE.RESONANCE ]`)
An intent made only of A–Z letters uses the original sum of distinct letter values (A=1 through Z=26), modulo 22. Any other letters use 32-bit FNV-1a over the ordered normalized letters encoded as UTF-8, also modulo 22. Each sigil variant uses the same selected reading and cue. The interface language is independent of input.

**Interface language** switches the controls and both Tarot reading editions between English, Japanese, Russian, and Icelandic. Each language includes all 22 cards.

---

## III. TECHNICAL NOTES

### Visual Design
- **Atari 2600 / ZX Spectrum aesthetic**: The Tarot keeps its low-resolution 64 × 64 pixel canvas
- **Mirrored Tarot composition**: Horizontal mirroring evokes Rorschach-style psychological projection
- **VHS effects**: Flicker and scanline filters at 0.66s cycles create visual instability
- **Glitch animations**: CSS transforms simulate cognitive disruption during the reveal

### Audio
Each Major Arcana card includes an associated ambient sound file (e.g., `tesla-coil-crackle.mp3`, `black-lodge-hum.mp3`) to enhance immersion in the reading.

---

## IV. THE MORPHYSTIC ARCANA

The traditional tarot has been recontextualized through Morphystic philosophy:

- **THE FOOL** → Forma Nihil (The unformed, pre-symbolic state)
- **WHEEL OF FORTUNE** → Recursive Captivity (Cyclical entrapment)
- **THE TOWER** → Symbolic Collapse (Breaking of constructed reality)
- **THE WORLD** → The Network Trap (Total enclosure)

Full interpretations appear during the Resonance Analysis phase.

---

## V. SETUP

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/sigil-forge.git
cd sigil-forge
```

2. Install dependencies:
```bash
npm install
```

3. Place audio files in `/public/sounds/`:
   - `static-void-hum.mp3`
   - `tesla-coil-crackle.mp3`
   - `black-lodge-hum.mp3`
   - etc. (see `App.jsx` for full list)

4. Run the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

---

## Phase 1 development

The original application is preserved at commit `7722b72`. Phase 1 separates the original generator, Tarot selection, stable card metadata and language catalogs. It fixes asset paths via Create React App’s `PUBLIC_URL` and adds compatibility and workflow tests. The illustrated edition and expanded readings have a separate [Tarot redesign specification](TAROT_REDESIGN_SPEC.md).

Run the tests from the repository root.

```sh
CI=true npm test -- --watchAll=false --runInBand
```

For a project subpath build, set its prefix before building.

```sh
PUBLIC_URL=/sigil-forge npm run build
```

## Phase 2 development

The [Monogram implementation report](SIGIL_FORGE_2_PHASE_2.md) documents construction, glyph coverage, SVG and PNG rendering, and validation. The Japanese centerline data is derived from Noto Sans CJK JP Regular and is distributed under the [SIL Open Font License](public/licenses/japanese-centerlines-OFL.txt).

## Phase 3 Tarot deck

All 22 Major Arcana now have straight-line faces and expanded English readings in Monogram mode. For a quick check, enter `V` for The Fool, `P` for The Tower, or `U` for The World. Forge the sigil and choose **Analyze Resonance**. Open **Original reading** to compare with the original text. [Full deck contact sheet](art/tarot/pilot/stick-study/deck-contact-sheet.png), [art masters](art/tarot/pilot/README.md)

## VI. A WARNING ON OVERUSE

**The sigil is not a toy.**

Repeated, mindless generation transforms a ritual tool into mere digital distraction—a pixelated Commodore 64 game reducing sacred practice to screen-staring compulsion. Spare's method demands singular focus: one intent, one sigil, one act of destruction (burn/delete), then deliberate forgetting.

Mass production of sigils without genuine intent or proper banishment creates psychic clutter, not liberation. The screen becomes a mirror-trap, the interface becomes the prison. Use sparingly. Use seriously. Or don't use at all.

---

## LICENSE

MIT License - See LICENSE file for details

---

*// AOS METHODOLOGY • CHAOS PROTOCOL • FORGET TO REMEMBER //*  
*// NORRLAND XXVI //*
