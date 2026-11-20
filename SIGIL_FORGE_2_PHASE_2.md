# SIGIL.FORGE 2.0 Phase 2 implementation report

Spare / Monogram is the default generator. The two Legacy options retain the original renderer, with a choice between the original ASCII rules and Phase 1 Unicode input. The 22 Tarot readings, procedural card artwork, audio references and redesign specification are preserved.

## Construction

Spare’s *The Book of Pleasure* describes simplifying and combining letters into a visual symbol. SIGIL.FORGE uses this principle as its starting point. Its normalized seeds, shape templates, fit scoring and stroke animation are new computational procedures. [Spare’s *The Book of Pleasure*, “Sigils. Belief with Protection”](https://www.tarrdaniel.com/documents/Thelemagick/zos/english/AOS_Book_of_Pleasure.html)

1. Phase 1 normalization folds full-width Latin and half-width kana, applies Unicode canonical normalization and uppercases cased scripts. Monogram keeps the first appearance of each resulting glyph for composition. The ordered sequence, including repetitions, contributes to the generation seed.
2. The current engine measures straight runs, bends and loops in each glyph’s centerlines. With multiple glyphs, it picks a supported silhouette from a spine, open arc, wedge, or bracket. A source feature supplies the silhouette type and influences its width. A one-glyph intent uses the glyph’s own centerline strokes.
3. The engine groups compatible features into shared paths. It fits remaining fragments into positions that leave open space around them. Longer inputs can retain up to three additional source features, such as a reversing curve, a zigzag, or a closed loop. Curves and zigzags join the outline at shared vertices. The composition is capped at ten paths, including accents. Each path records which normalized glyphs contributed to it.
4. The geometric endpoint uses straight segments. Increasing organic form bends the composition and rounds strokes with Bézier controls. The output uses a padded 640 × 640 frame with round joins and caps.
5. A versioned seed combines the normalized sequence and contributing glyphs. The variation number cycles through supported silhouettes and changes the finish, including for inputs with just one available silhouette. The same intent, settings and variation number reproduce the geometry in this engine version.

The silhouette and junction layouts are computational abstractions informed by the supplied traces. A fragment can stand for several glyphs, and the output can be too abbreviated to recover the source text from the image alone. [Reference traces](art/sigil_references_traces), [composition engine](src/sigil/monogram/composition.js)

## Script support

| Script | Construction and scope |
| --- | --- |
| Latin and Icelandic | Original centerline templates for A–Z and common extended Latin forms. Icelandic Þ, Ð and Æ have dedicated shapes. Accents such as those on Á and Ö are separate stroke components. |
| Cyrillic | Original templates for the full Russian alphabet and selected extended letters. Ё and Й retain their marks. Visually equivalent Latin and Cyrillic forms can share a stroke shape while retaining separate source identities. |
| Japanese | A lazily loaded set of 6,543 kana and kanji shapes derived from the Japanese face of Noto Sans CJK Regular 2.004. It covers the standard JIS X 0208 kanji range and selected extras such as 𠮷 and 髙. Kana voicing uses dedicated dakuten and handakuten components. Font thinning traces centerlines and junctions. The order is computational and is unsuitable as a handwriting or stroke-order guide. |
| Mixed script | Native outlines enter the same fusion process. Unsupported letters, variant selectors and unrecognized mark combinations are identified before forging. The full intent stays editable. |

The workshop has a cap of 32 distinct glyphs and 4,096 UTF-16 input units. Word spacing, punctuation and emoji remain outside the letter-based construction. Monogram can use 〇 as a shape. When other letters are present, Tarot still follows the Phase 1 mapping for those letters. An intent made only from 〇 uses the Unicode Tarot rule. The Japanese data stays on-device after the chunk loads from the application host. It has no runtime font or external service dependency. The reproducible extractor uses Python, Pillow and NumPy and ships alongside the source. [Glyph handling](src/sigil/monogram/glyphs.js), [extractor](scripts/build-japanese-strokes.py), [font upstream](https://github.com/notofonts/noto-cjk), [bundled license](public/licenses/japanese-centerlines-OFL.txt)

## Workshop and export

The red-on-dark vector plate uses a static scanline texture and a restrained control column beside the mark. The workshop uses the engine’s default form and detail. **Reveal construction** clears the plate and reveals the current sigil stroke by stroke. With reduced motion enabled, the first forge shows the finished mark immediately and the replay presents each stroke as a static step. **Focus view** hides the workshop controls and framing, with an exit button and Escape shortcut.

SVG export uses a 640 × 640 viewBox and scales independently of screen resolution. PNG export renders the same vector paths at 2400 × 2400 using Canvas 2D. Both use the same stroke widths, caps, joins and ink. The transparency setting applies to both formats. Preview framing, animation, source letters and the seed are excluded from both files. PNG export releases its canvas backing store after encoding. [Workshop](src/sigil/monogram/MonogramStudio.jsx), [export renderers](src/sigil/monogram/export.js)

## Original Phase 2 verification

- All 84 tests and the Tarot snapshot passed. Tests cover the original 22 outcomes, reproducibility, shape variation, ancestry, mixed scripts, rejected characters, valid and padded SVG paths, the same path and width inputs to both export formats, canvas cleanup, and the new and Legacy app flows.
- ESLint passed with zero lint warnings. Production builds for `/` and `/sigil-forge/` passed. CRA printed its existing Browserslist data-age notice.
- Both production bundles passed a DOM smoke test for Latin and Japanese forging, lazy Japanese chunk resolution, export requests, Legacy resolution and the original audio paths. The initial JS contains about 65.4 kB gzipped and the stylesheet about 1.19 kB. Japanese centerlines add about 470.46 kB gzipped on first use. The Latin workflow did not request that chunk.
- All 6,543 bundled Japanese glyphs generated a mark individually in a Node probe. A separate warm test generated 200 variants per specimen, releasing each result. Eleven mixed-script glyphs took 2.30 ms median and 4.91 ms at the 95th percentile. The 32-glyph specimen took 7.84 ms median and 12.59 ms at the 95th percentile. Post-GC heap differences were about +0.14 MiB and +0.04 MiB. Heap sampled during the tests peaked about 10.12 MiB and 20.45 MiB above their respective baselines. These are local engine measurements and exclude layout, device rendering and initial font-data transfer.
- SVG samples were rasterized independently and visually checked. Chromium launch hit a sandbox restriction, Firefox exited during headless launch, and the browser tool required approval unavailable in this session. Real-browser animation, Canvas PNG pixels and transparency, actual download behavior, audible playback and mobile layout remain unverified.

See the [session handoff](SESSION_NOTES.md#last-verification) for verification of the current structure-first engine.

## Phase 3 handoff

The Tarot phase continues to use the card ID computed during intent reduction. Form, detail, variant and interface language changes leave that ID in place. Phase 3 can add the proposed illustrated edition using the existing [Tarot redesign specification](TAROT_REDESIGN_SPEC.md) and card catalog. Before release, check the workshop on desktop and touch browsers, including reduced motion, fonts, PNG alpha and audio. The Japanese, Russian and Icelandic interface catalogs still use the English fallback.

The Latin multi-letter layout now selects a shared structural feature and takes the complete pen stroke containing it from a source glyph. Branches join along the measured length of that contour. Variations can choose another donor contour. Mixed-script and non-Latin compositions retain the earlier frame layouts. This is a computational interpretation of the reference sheets.
