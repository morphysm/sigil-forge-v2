# SIGIL.FORGE session handoff

## Where we stopped

All 22 Major Arcana now have their locked straight-line faces and expanded English readings in the Monogram workflow. The green subject and egg-white supporting strokes are on pure black. The user approved supplied variants for The Fool, Strength and Justice. The Fool holds a flower at the right-hand brink. Strength shows the full figure with the lion beneath a closed infinity symbol. Justice shows a crowned figure between pillars with a green sword and scales.

The latest Monogram pass uses the supplied sigil traces to guide composition. The engine starts with a dominant source shape, joins compatible fragments to it, and leaves open space for small secondary marks. The tiger intention in the Spare reference gives five paths, with all 15 distinct source letters traceable. At the user’s request, the workshop now uses the engine’s defaults for form and detail.

**Reveal construction** now clears the plate and reveals each path in sequence. Previously the replay finished quickly, and a browser with reduced motion enabled showed the finished sigil throughout. Replay uses static steps with reduced motion.

The **Stroke sources** panel was removed at the user's request. The engine's tests still check how strokes trace back to the input.

The Monogram sigil uses pure red ink (`#FF0000`) in the preview and both export formats. The preview's background glow is dimmer so thin inner strokes have more contrast.

The illustrated Tarot reading uses pure red (`#FF0000`) for the card title, numeral, and section labels, with white for the reading text. The **Analyze Resonance** button uses the same red background with a white label, matching **Forge New** in Monogram.

Japanese, Russian, and Icelandic now have interface translations and all 22 cards in both reading editions. The translations preserve source terms such as Morphystic, Forma Nihil, and Sitra Achra and retain the distinct spellings Wyrmos and Wyrmws. The new translations are ready for native-speaker review.

The original application is preserved at commit `7722b72`. This checkpoint saves the Phase 1 foundations, Monogram workshop, and localized Phase 3 Tarot deck together. Deployment is a separate step.

## What is in place

- **Phase 1** separated intent normalization, Tarot selection, card metadata, and locale catalogs. It fixed logo and audio paths at subpath deployments. Intent script and interface language are independent.
- **Phase 2** made Spare / Monogram the default. It combines normalized character strokes into deterministic, traceable sigils. It supports Latin, Icelandic, Cyrillic, and mixed-script input, with 6,543 lazily loaded Japanese glyph shapes. The workshop offers seeded variations, construction replay, and Focus view. Export is SVG or 2400 × 2400 PNG with optional transparency.
- **Legacy** remains available through the original ASCII mode and the Phase 1 Unicode option, both using the original renderer. The 22 Tarot IDs, original English readings, procedural card visuals and audio references are preserved.
- **Phase 3 deck** ships 19 vector masters, three approved PNG variants, responsive 420 × 630 and 600 × 900 exports, alt text, and six expanded English reading fields per card. Earlier pilots remain in the [art archive](art/tarot/pilot/README.md).

## Files to read when resuming

| File | Use |
| --- | --- |
| [Locked deck contact sheet](art/tarot/pilot/stick-study/deck-contact-sheet.png) | All 22 faces at thumbnail size in card order. |
| [Earlier painted pilots](art/tarot/pilot/painterly-contact-sheet.png) | Previous art exploration. |
| [TAROT_REDESIGN_SPEC.md](TAROT_REDESIGN_SPEC.md) | Review the visual, editorial, animation, sound, and translation briefs for all 22 cards. |
| [SIGIL_FORGE_2_PHASE_2.md](SIGIL_FORGE_2_PHASE_2.md) | Phase 2 implementation, script coverage, export, performance, and verification details. |
| [SIGIL_FORGE_2_AUDIT.md](SIGIL_FORGE_2_AUDIT.md) | Original repository audit and upgrade sequence. |
| [Sigil reference traces](art/sigil_references_traces) | Spare’s tiger example and a sheet of compact handwritten marks that informed the new composition. |
| [src/tarot/cards.js](src/tarot/cards.js) | Stable Tarot IDs, existing audio paths, and slots for future illustrations. |
| [src/i18n/locales/legacy.en.js](src/i18n/locales/legacy.en.js) | Verbatim original readings. |
| [src/sigil/monogram/](src/sigil/monogram) | New generator, glyph data, workshop UI, and export code. |

## Last verification

- **157 automated tests** and the Tarot snapshot passed. ESLint and production builds for `/` and `/sigil-forge/` passed. Tests cover the three localized interfaces and every card in both reading editions. Production DOM checks verified switching languages on The Fool with the original reading open, including the artwork and audio paths under both base URLs. The replay test verifies stroke order, restart, and cancellation.
- The revised SVGs were rasterized and visually checked across Latin, Icelandic, Cyrillic, Japanese and mixed-script examples. A local probe checked bounded paths and source tracing for all 6,543 bundled Japanese glyphs in mixed-script compositions.
- Headless Chrome exited on a sandbox socket restriction. Real-browser animation, mobile layout, rendered PNG pixels and transparency, downloads, and audible playback remain unverified.
- Run `CI=true npm test -- --watchAll=false --runInBand` to recheck the baseline.

## Exact next step

Test language switching on the forge and Tarot screens. Try `V` for The Fool, switch between 日本語, Русский, and Íslenska, and open the original reading. Remaining Tarot work includes translation review, browser checks, and audio rights and design.
