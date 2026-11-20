# SIGIL.FORGE 2.0 repository audit and upgrade plan

Audit of `main` at `7722b72` on 19 November 2026. The production build and lint check passed. Jest found zero tests. A temporary DOM probe exercised all 22 resonance results. The checkout contains a logo and all 22 referenced MP3s. Card faces are procedural pixel patterns. The interface and readings are English-only. This report is the sole project deliverable from the investigation.

**Proposed direction.** Keep the 1.0 generator and its Tarot mapping available as Legacy Mode. Add a separate stroke-based Monogram engine and a versioned, Unicode-aware resonance rule. Keep the original English readings verbatim and build the expanded readings and illustrated deck alongside them. Treat the art and the Morphystic editorial review as production work with their own milestones.

## 1. Repository structure and architecture

| Location | Responsibility |
| --- | --- |
| [`src/index.js`](src/index.js) | Mounts a single React root in Strict Mode. |
| [`src/App.jsx`](src/App.jsx) | Owns all six state values, all four screens, the 22-card manifest, input reduction, both canvas renderers, download, audio, inline styles and keyframes. |
| [`public/index.html`](public/index.html) | Static HTML shell, UTF-8, viewport, English document language and root element. |
| [`public/logo.jpg`](public/logo.jpg) | 300 × 285 brand mark, a green symbol on black. The header forces a square display. |
| [`public/sounds/`](public/sounds) | 22 tracked MP3s and a placeholder. |
| [`package.json`](package.json), [`package-lock.json`](package-lock.json) | npm scripts, CRA ESLint preset, Browserslist targets and v3 lockfile. |
| [`README.md`](README.md), [`GITHUB_SETUP.md`](GITHUB_SETUP.md), [`CONTRIBUTING.md`](CONTRIBUTING.md), [`AUDIO_SOURCES.md`](AUDIO_SOURCES.md), [`LICENSE`](LICENSE), [`.gitignore`](.gitignore) | Product description, optional hosting instructions, editorial constraints, sound list, MIT code license and ignore rules. |

The repository root contains no `AGENTS.md`. The parent workspace has one, and its audit guidance was followed. There are no tracked test suites, localization directories, fonts, standalone stylesheets, card image files, hosting manifests, or CI workflows. The tracked app is a static, client-rendered SPA with no router, backend, API calls, user accounts, analytics or saved-intent storage in its source. Intent, reduced letters, the sigil PNG, current phase, card and audio object live in React state. Reset clears the session state and pauses/rewinds the active audio. Downloaded files are managed by the browser and operating system.

React and React DOM are declared as `^18.2.0` and resolve to `18.3.1`. The package pins `react-scripts` at `5.0.1`, which supplies webpack `5.105.4`, Jest `27.5.1`, ESLint `8.57.1`, Babel and the CRA development server through its dependency tree. The audit used Node `22.23.5` and npm `10.9.9` with the existing dependencies. The README's Node 14+ claim was not verified. The repository has no `engines` entry or Node version file.

| Command | Purpose |
| --- | --- |
| `npm ci` | Reproduce the lockfile from a clean checkout. Existing installed dependencies were used for this audit. |
| `npm start` | CRA dev server, normally at localhost:3000. |
| `npm run build` | Static production output in `build/` by default. |
| `npm test` | CRA/Jest runner, generally in watch mode during development. |
| `npm run eject` | One-way CRA configuration expansion. It was not run. |

The default build assumes hosting at `/`. GitHub Pages, Netlify and Vercel are documented options. There is no `homepage`, Pages script, hosting config, or tracked workflow that confirms the live host. The Git remote points to `morphysm/sigil-forge`. The audit covered this checkout and locally available Git history.

## 2. Current features and verification

The workflow is **intent → reduced letters → forged sigil → resonance → return to void**. Internally, that is `step` 0, 1, 3 and 4. Cancel returns from reduction to an empty intent. The forged screen offers download or reset. Resonance replaces the forged screen with the card and its reading. The Tarot remains a one-card reflection system driven by the intent's spelling.

| Check | Result |
| --- | --- |
| `CI=true npm run build` with temporary `BUILD_PATH` | Passed. Main JS was 50.62 kB gzipped. CRA warned about stale Browserslist data. |
| Same build with `PUBLIC_URL=/sigil-forge` | Passed. The HTML points to the prefixed JavaScript bundle. Runtime logo and sound URLs still begin at the origin root. |
| `node_modules/.bin/eslint src` | Passed. It emitted the same browser-data warning. |
| `CI=true npm test -- --watchAll=false --runInBand` | Exit 1, “No tests found.” Zero assertions ran. |
| Temporary jsdom probe of the production bundle | Hit every card ID and checked titles, themes, reading text, audio URLs and purge. Exercised reduction, canvas drawing calls, the download anchor, cancel/reset and multilingual inputs. Canvas, audio and download were instrumented with test doubles. |
| Asset inventory and FFmpeg decoding | All 22 referenced MP3s are present and fully decoded by FFmpeg. There are no extra MP3s or missing references. Justice and The Star use differently named copies of the same bytes. Together the tracks occupy 543,559 bytes. Durations range from about 1.10 to 5.64 seconds. |
| `npm audit` | Inconclusive. The environment could not resolve `registry.npmjs.org`. No vulnerability count was obtained. |
| `npm start` | The development server reached the port check, which failed with `listen EPERM` under the sandbox. |
| Browser playback, download and layout | Unverified. Chromium could not launch inside the shell sandbox, the browser tool required unavailable approval and a local HTTP bind was denied. The subpath result comes from build and file-path verification. |

In the forged screen, an offscreen 600 × 600 Canvas 2D bitmap is encoded by `toDataURL()` and displayed in an image. **Download** clicks a temporary anchor with `sigil.png` as its filename. The opaque grid and canvas strokes are part of the image. The preview's CSS border and animated outer glow are applied to the image element. Export has one resolution and format and is offered before resonance. [Forging and export](src/App.jsx#L64)

The visual language is a green-on-black terminal interface with red outlines, a red sigil and red card pixels. The forge button pulses continuously, the sigil preview animates its shadow and scale, and resonance plays a 0.5-second screen shake and hue shift, a twice-repeated title glitch, a 0.66-second alternating VHS flicker, and a two-second paragraph fade/slide named `typewriter`. The last effect reveals the whole paragraph, and the scanlines are drawn once per canvas paint. Each reading requests its assigned MP3 once at volume 0.5. An audio rejection only logs “Audio blocked.” [Forge effects](src/App.jsx#L361), [reveal and card canvas](src/App.jsx#L500), [audio handler](src/App.jsx#L111)

## 3. Confirmed findings and potential regressions

| Evidence | Finding | Consequence |
| --- | --- | --- |
| Reproduced in DOM | A nonblank input that yields no ASCII letters silently becomes `X` and selects card 2. Mixed-script input can lose letters, and equivalent accented spellings can produce different cards. | The displayed core can misrepresent the statement. See the Unicode cases in §6. |
| Production artifact and DOM verified | The subpath build loads its script from `/sigil-forge/`, but the app requests `/logo.jpg` and `/sounds/…`. | A host exposing files only under the application prefix cannot serve those two requests. An origin-root deployment has matching files. |
| Reproduced in DOM | Different five-letter inputs produce identical stroke coordinates when fed the same random samples. | Letter identity and order are absent from geometry. The README's randomized letter-coordinate mapping overstates the implementation. |
| Reproduced in DOM | The Fool is made up of horizontal bands. For the same card, changing only trailing whitespace can change the graphic. | The procedural graphic has no illustrated archetype and its input sensitivity differs from the reduction rule. |
| Source and file checks | All 22 clips are checked in despite `AUDIO_SOURCES.md` saying they are excluded. README setup still instructs users to supply them. Twenty-one clips are shorter than the documented recommendation of 5–15 seconds. | The setup docs are stale. Clip provenance and redistribution rights are unresolved from the repository. |
| Source confirmed | Buttons replace the focused DOM node on phase transitions with no focus handoff. The textarea has a placeholder and nearby prompt but no associated label. Continuous motion has no reduced-motion branch. | Keyboard, screen-reader and motion-sensitive UX need verification and explicit support. |
| Source confirmed | Empty input gets no visible feedback, a missing 2D context returns silently, and rejected audio has no visible status or retry. | Users can receive a silent no-op. Test actual browsers and fault cases before changing controls. |
| Reproduced in DOM | The sigil/download controls disappear after analysis. | Anyone intending to keep the result must export it first. Preserve this flow in Legacy and decide whether 2.0 keeps export available beside the reading. |

Potential regressions to verify include clipped content on narrow screens because several elements combine content-box `width: 100%`, padding and borders under `overflow-x: hidden`. The long nonwrapping header line and localized text can increase the risk. Synchronous data-URL encoding, mobile/Safari download behavior, repeated media requests across transitions, and the cost of animated filters on low-end devices remain unmeasured. The canvas ref callback couples drawing to React commits. Audio cleanup is tied to reset and cancel handlers, so future navigation or unmounting needs an explicit cleanup path. These are source-derived risks.

## 4. Sigil engine evaluation and modernization

### Legacy baseline

`processIntent` rejects whitespace-only input, uppercases the string, removes whitespace, and keeps first occurrences that match `[A-Z]`. A nonblank input that leaves no accepted letter becomes `X`. Punctuation and numbers are filtered. Vowels are retained. The forge draws one random polyline using a starting point plus `max(4, uniqueLetters.length)` segments. Each coordinate is chosen independently between 100 inclusive and 500 exclusive. The canvas adds a 25 px green grid, a thick red shadowed stroke and a thin white center stroke. There is no letter-shape mapping, coordinate seeding or mirroring in this renderer. The mirrored 64 × 64 image described in the README belongs to Tarot. [Reduction and forge](src/App.jsx#L49)

Preserve the existing ASCII filtering, random segment count and visual settings under **Legacy Mode**. Preserve its Tarot mapping and file format. Capture the odd-input behavior—including the `X` fallback—as an explicit compatibility case. Explain when the fallback occurs and offer Monogram for supported native-script input.

### Historical basis and design choices

In *The Book of Pleasure* (1913), “Sigils. Belief with Protection,” Spare describes simplifying and combining alphabetic forms. He illustrates a wish composed from smaller groups and combined into one sigil, with a further simplified version. The stated visual goal is a form readily called to mind with little pictorial resemblance to the desire. This supports compositional abstraction and simplification. Exact first-occurrence deduplication, optional vowel removal, ASCII-only filtering, random coordinates and Tarot numerology should each be described as product rules or later conventions. The README's digital deletion and print/burn instructions are application ritual framing. [Spare's text and illustrated example](https://www.tarrdaniel.com/documents/Thelemagick/zos/english/AOS_Book_of_Pleasure.html), [facsimile with the combined sigil](https://jugueteriadiabolica.com/wp-content/uploads/2021/03/The-Book-of-Pleasure.pdf)

### Proposed Spare / Monogram Mode

1. **Prepare the letter forms.** Normalize the input under a versioned script policy (§6), then extract unique graphemes. Start with authored single-line skeletons and anchors for Latin and Cyrillic, including Icelandic letters and Russian Ё. Select a dominant structural stroke from the available forms. Preserve source-to-stroke links in memory for the construction sequence.
2. **Fuse strokes.** Fit other forms to the spine by matching compatible stems, endpoints, junctions, arcs and counters. Merge overlapping strokes. A curved form can share a stem or leave a deliberate gap around it. A diacritic can contribute an offset accent or small cut while retaining its place in the composition. Prefer plausible joins and legible negative space at icon size. For an input such as `ART`, the diagonal of A can become part of R's leg, and a shared crossbar can carry the contribution from T without laying three full glyphs side by side.
3. **Abstract the result.** Apply bounded rotation, offsets, tapered terminals and selected Bézier smoothing. Allow an off-center center of mass and a small number of intentional secondary strokes. Score a bounded candidate set for excessive intersections, collapsed counters, overlap, cropping and complexity. One-letter inputs get a deliberate stylized mark, and long inputs receive a clear reduction or complexity policy. Set the limits with real samples before release.
4. **Offer controlled variation.** Use a versioned local seed with a separate variant number. Keep the same letter set, stroke ancestry and resonance across variants. Offer a small deliberate choice of compositions while retaining the ritual flow. Matching inputs and mode versions should reproduce the same construction in the same renderer. Candidate scoring, seeded selection, style parameters and the renderer are new computational experiments.
5. **Animate and export one geometry.** Render self-contained SVG paths with a fixed viewBox and optional filled tapered shapes. Draw lead strokes, fuse secondary strokes, then settle into the final silhouette. A short path reveal or opacity sequence can share the static geometry. Reduced motion shows the final image immediately. Produce SVG from the final paths and PNG via an offscreen canvas with `toBlob()`. Embed no intent text, remote fonts or external references in output. Keep the 600 × 600 Legacy PNG path and verify both SVG and print-size PNG output against the settled preview.

Keep the pure reducer, selector and geometry builder separate from presentation, sound and export. Store a small phase/state model, stable card ID, algorithm version, and in-memory session data. Keep the drawing and selection algorithms independently testable.

## 5. The 22 Major Arcana

### Selection and existing artwork

The selector sums the **unique** ASCII letters as A=1 through Z=26, takes the remainder modulo 22 and indexes `arcanaManifest`. `ABC` yields 6, The Lovers, while `V` yields 0, The Fool. All cards are reachable with one letter (V for 0 and A–U for 1–21). Identical retained letter sets in any order select the same card, and different sets can collide whenever their sums share a remainder. There is one fixed reading per ID. The act of drawing the sigil, the original statement's meaning and the selected picture have no influence on card selection. The order matches the familiar Rider–Waite–Smith numbering for Strength VIII and Justice XI. Retain the existing numeric IDs even if future editions change typography or names. [Selector and manifest](src/App.jsx#L11), [Waite's *Pictorial Key to the Tarot*](https://sacred-texts.com/book/the-pictorial-key-to-the-tarot)

All cards use the same 64 × 64 Canvas 2D algorithm, displayed at 180 × 180 CSS pixels. It paints mirrored 4 × 4 red blocks when `sin(x * cardIndex + y * intent.length) > 0.2`, then draws dark scanlines. `intent.length` counts UTF-16 code units, including spaces and punctuation. The Fool (index 0) drops the x term altogether, yielding stripes. Every card returned a distinct drawing trace in the one-character test, but any two inputs with the same card and raw length share the same pattern. The repo has zero illustrated card faces or card backs. The pixel treatment can serve as a Legacy visual or a static transition motif. The header logo is reusable as branding. [Card renderer](src/App.jsx#L567)

### Inventory and editorial assessment

Exact existing titles, themes and original readings are in the [1.0 manifest](src/App.jsx#L11), also recoverable verbatim with `git show 7722b72:src/App.jsx`. All sound references below are tracked and decode. Justice and The Star reference different filenames with byte-identical contents. The app renders the same generic animation and paragraph layout for every row.

| ID and card | Current Morphystic theme | Audio | Reading assessment |
| --- | --- | --- | --- |
| 0 The Fool | Forma Nihil | `static-void-hum.mp3` | A pre-symbolic origin fits the threshold, but the last “it” has no clear referent and the risks of beginning are unexplored. |
| 1 The Magician | The Cainite Operator | `tesla-coil-crackle.mp3` | The operator and fractures in Wyrmos make a specific image. Code-twisting overlaps the Emperor and lacks a distinction between skill and control. |
| 2 The High Priestess | Sitra Achra Current | `black-lodge-hum.mp3` | Sowilo-wave, dark-light and Other Side appear in quick succession. The reading gives the user little way to examine intuition or uncertainty. |
| 3 The Empress | The Bio-Prison | `womb-heartbeat-hum.mp3` | The first Prison Loop provides a clear premise. Generativity, care and dependence are absent from its treatment of embodiment. |
| 4 The Emperor | Wyrmws Architect | `machine-grid-hum.mp3` | The program metaphor is brief and repeats the Magician's insurgency. Compare `WYRMWS` in the theme with `WYRMOS` in card 1 before editorial normalization. |
| 5 The Hierophant | Semantic Encryption | `cathode-ray-hum.mp3` | Names moral and linguistic conditioning. An example of received language or ritual authority would make the abstraction diagnostic. |
| 6 The Lovers | The Phenomenal Self-Model | `mirror-feedback-whine.mp3` | The false twin is a distinctive image. Immediate destruction leaves mutuality, values, projection and choice unexplored. |
| 7 The Chariot | Accelerationist Drive | `doppler-engine-hum.mp3` | The single sentence names Cainite will and acceleration and leaves direction, divided motives and the cost of speed unexamined. |
| 8 Strength | Bio-Terminal Mastery | `synapse-firing-crackle.mp3` | The reprogramming metaphor reads as an imperative to override the body. It can be developed through restraint and the ambiguity of self-command. |
| 9 The Hermit | Opacity Collapse | `single-bulb-hum.mp3` | The light outside the mirror gives it a visual anchor. “Total exile” collapses chosen solitude and isolation into one prescription. |
| 10 Wheel of Fortune | Recursive Captivity | `loop-tape-hiss.mp3` | Pattern detection is already a practical opening. Distinguish recurring circumstances from a rehearsed response and retain the metaphysical reference in its context. |
| 11 Justice | Symbolic Consequence | `balance-tone-hum.mp3` | Contrasts truth and moral architecture without showing how consequences persist or whose measure is used. |
| 12 The Hanged Man | PSM Inversion | `reverse-frequency.mp3` | A useful invitation to question the obvious. Expand PSM on first encounter and give suspension its own tension with avoidance. |
| 13 Death | Loop Termination | `flatline-dissolve.mp3` | Ending and reconfiguration are present. “Only freedom” and “purge human ancestrality” need careful contextualization around the end of a pattern or role. |
| 14 Temperance | Entropy Modulation | `phase-shift-hum.mp3` | The unstable interval is distinctive. The text could show what modulation changes and when adjustment becomes postponement. |
| 15 The Devil | Dopaminergic Chain | `pleasure-pulse-hum.mp3` | Pleasure and constraint are well paired. “Demiurgic juice” obscures the choice and can be mistaken for a literal account of neurochemistry. |
| 16 The Tower | Symbolic Collapse | `power-surge-crash.mp3` | The broken mirror gives the card immediate identity. The command to rejoice skips loss and the possibility of rebuilding the same structure. |
| 17 The Star | Post-Collapse Signal | `signal-beacon-hum.mp3` | Quiet after rupture is already differentiated from The Tower. Make fragile orientation and openness to revision more concrete. |
| 18 The Moon | Ego Tunnel Shadows | `night-frequency-hum.mp3` | Borrowed identity gives the reader a clear problem. Develop ambiguity, competing interpretations and the cost of forcing certainty. |
| 19 The Sun | Total Clarity | `solar-drone.mp3` | Visibility is a strong premise. “The upload of it” leaves the referent unclear and the reading omits exposure and the limits of what can be seen. |
| 20 Judgement | Final Rupture | `trumpet-frequency.mp3` | The call and last mirror evoke reckoning. Rupture repeats imagery from Death and The Tower without asking who answers for the past. |
| 21 The World | Ouroboros — The Network Trap | `network-hum-loop.mp3` | The closed circle is memorable. Give successful completion some weight so enclosure can be examined as a cost of total integration. |

### Art direction and asset production

Use the Smith deck as an archetype and iconography reference for this edition. Build a common plate format with black ink masses, oxide-red spot color, a light paper tone for selected highlights, heavy letterpress borders and coarse carved marks. German Expressionist woodcut supplies skewed planes and abrupt silhouettes. Seventeenth-century broadside woodcuts supply the compact picture and caption relationship, while alchemical engravings supply emblem composition, measured hatching and symbolic objects. Keep the CRT green in the terminal UI and use it sparingly near the art. The three references inform different parts of the visual system. [MoMA's Expressionist woodcut collection](https://www.moma.org/s/ge/curated_ge/techniques/woodcut.html), [UCSB broadside woodcut archive](https://ebba.english.ucsb.edu/page/woodcuts), [Merian's alchemical engravings in *Atalanta Fugiens*](https://digital.sciencehistory.org/works/pc289j53n/viewer/d217qq47g)

Design a shared back and frame in code. Produce separate authored artwork for each face. Test three composition types in the pilot by using an open diagonal for The Fool, a fractured vertical for The Tower and an enclosed circle for The World. Use commissioned illustration or a dedicated illustration workflow with art direction, review and finishing across the set. Cleared historical art is an option for reference or compositing with recorded source and terms. Any generated drafts still need composition, symbol and consistency review. Require 22 distinguishable silhouettes at thumbnail size, a readable foreground, and a visible traditional anchor and Morphystic motif for each plate. Store master files separately from compressed delivery assets, record credits and rights, and give each meaningful illustration localized alt text. Use live text for titles and numerals.

Use a fixed portrait aspect ratio with responsive images and request only the selected card. Keep the title and core reading available as soon as resonance is computed, including during artwork loading or failure. Reveal a shared back with a short opacity/transform sequence, a slight lift and a red edge accent. Use static grain baked into the artwork. Reduced motion reveals the face immediately and disables flicker and shake. An optional explicit sound control can preserve the cues with predictable stop and retry behavior. Archive the original sounds and consider a separate approved cue for Justice or The Star. Test the art, typography and audio together. Use a display face for names where glyph coverage permits, a readable body face in sentence case, and locale-specific fallbacks. Keep the terminal monospace for controls and short identifiers.

### Reading structure and 22 proposed briefs

Give each expanded reading an **archetype**, a **Morphystic reading**, an **intent reflection**, a **tension**, a **question**, and a short **closing line**. Ask the user to apply the prompt to their statement. The app uses the statement’s spelling to select a fixed reading, and the user supplies the interpretation. Keep the literal intent hidden after reduction unless disclosure is chosen. Write conditional, diagnostic passages that expose competing possibilities and avoid predictions. Treat references to the body, cognition and reincarnation as part of the symbolic framework.

[`CONTRIBUTING.md`](CONTRIBUTING.md) identifies the present readings as the doctrinal core and attributes them to *The Black Book of Morphysm*. That book is not in the repo. Preserve `legacy.en` verbatim under stable IDs and include an **Original reading** toggle or side-by-side review in development. Introduce a separate version for expansions and an editorial glossary with approved spellings, capitalization, transliteration and short explanations. Check Wyrmos/Wyrmws, PSM and its link to card 6, Sitra Achra/Sowilo, Forma Nihil, Prison Loop, Cainite Operator/Cainite Protocol, demiurgic language, Bio-Terminal and the Network Trap with the maintainer. Treat the following compositions and readings as drafts for editorial review.

#### 0 · The Fool
- **Art** — A traveler and small dog cross a torn plate edge. Bare paper beyond the cliff represents Forma Nihil.
- **Reading** — **Archetype** · Beginnings and risk. **Morphystic** · Forma Nihil before the intent hardens into a role. **Intent** · Find the first move your statement permits without a complete plan. **Tension** · Openness can be curiosity or refusal to reckon with consequences. **Question** · Can you begin before you can say who begins? **Close** · Leave the beginning open.

#### 1 · The Magician
- **Art** — A raised wand above a workbench with the four tools. One hand pulls a red seam in the grid below.
- **Reading** — **Archetype** · Skill and agency. **Morphystic** · The Cainite Operator works with a fracture inside the system. **Intent** · Identify the tool your statement already puts within reach. **Tension** · Mastery can widen agency or reproduce the rules that trained it. **Question** · Who set the terms of the operation you call your own? **Close** · Locate the point of leverage.

#### 2 · The High Priestess
- **Art** — A seated reader with a partly covered scroll between two pillars. A thin red wave runs behind the veil.
- **Reading** — **Archetype** · Veiled knowledge. **Morphystic** · Use the Sitra Achra Current and Sowilo-wave as images of partial access beyond the mirror. **Intent** · Name what your wish presumes you already know. **Tension** · Attention to the obscure can deepen inquiry or license projection. **Question** · When does guarding a mystery become guarding an answer? **Close** · Allow the obscurity to remain.

#### 3 · The Empress
- **Art** — A seated figure amid wheat. Roots below the throne trace a cell-like enclosure.
- **Reading** — **Archetype** · Generation, nurture and dependence. **Morphystic** · The Bio-Prison provides the conditions in which a desire first takes form. **Intent** · Identify the bodily or material support your wish presumes. **Tension** · Care sustains growth and can tie growth to approval. **Question** · What kind of freedom can grow through dependence? **Close** · Count what sustains the wish.

#### 4 · The Emperor
- **Art** — A ram-headed throne dominates an off-center architectural plan. One red datum line holds the blocks in place.
- **Reading** — **Archetype** · Order and authority. **Morphystic** · The Wyrmws Architect stages the program by which a rule becomes ordinary. **Intent** · Identify who defines success in your statement. **Tension** · A structure can protect continuity and curtail revision. **Question** · What authority does the act of rewriting require? **Close** · Find the rule beneath the outcome.

#### 5 · The Hierophant
- **Art** — A raised hand, crossed keys and two listeners. A red ribbon becomes repeated lettering as it crosses the plate.
- **Reading** — **Archetype** · Teaching, tradition and sanctioned meaning. **Morphystic** · Semantic Encryption carries conditions inside inherited words. **Intent** · Locate a phrase you may have received from an institution or community. **Tension** · Shared language makes a wish intelligible and limits what can be said. **Question** · Can you contest a rule in the vocabulary that transmits it? **Close** · Read the terms you inherited.

#### 6 · The Lovers
- **Art** — Two figures beneath a witness, facing across a cracked reflective surface whose images diverge.
- **Reading** — **Archetype** · Relation and choice. **Morphystic** · The Phenomenal Self-Model can cast the other as a witness to a preferred self. **Intent** · Ask whose recognition would make the wish feel complete. **Tension** · Intimacy seeks to be seen and can demand that another person play a part. **Question** · Can the other remain other when their recognition matters this much? **Close** · Give the other room to answer.

#### 7 · The Chariot
- **Art** — A charioteer and two opposed draft creatures, with diagonal red tracks pulling against the chassis.
- **Reading** — **Archetype** · Direction under competing impulses. **Morphystic** · Accelerationist Drive tests where Cainite will is carrying the existing structure. **Intent** · State what faster progress would do to the actual aim. **Tension** · Momentum can force change and carry old assumptions forward. **Question** · What is steering when speed feels like agency? **Close** · Check the direction of travel.

#### 8 · Strength
- **Art** — An open hand on a lion's jaw, a broken lemniscate above, red cuts following the point of contact.
- **Reading** — **Archetype** · Courage and patient restraint. **Morphystic** · Bio-Terminal Mastery can be read as working with an impulse through the embodied interface. **Intent** · Identify an impulse your wish would require you to tolerate or redirect. **Tension** · Restraint allows action and can become a demand for total control. **Question** · Does mastery make room for the force that resists it? **Close** · Hold the force with care.

#### 9 · The Hermit
- **Art** — A cloaked lantern-bearer occupies one small corner of a black slope. The lantern interrupts a faint field of mirrored marks.
- **Reading** — **Archetype** · Withdrawal and discernment. **Morphystic** · Opacity Collapse asks what becomes legible when social reflection is suspended. **Intent** · Read the statement as if nobody would ever applaud it. **Tension** · Solitude can make perception possible and shield it from correction. **Question** · Who can tell you what your lamp leaves outside its beam? **Close** · Make room to see privately.

#### 10 · Wheel of Fortune
- **Art** — A wheel with ascending and descending figures. Its rim is a red tape loop with one exposed splice.
- **Reading** — **Archetype** · Turning circumstances and cycles. **Morphystic** · Recursive Captivity asks how a Prison Loop reproduces its apparent novelty. **Intent** · Find the point where you usually renew the same response. **Tension** · Recognizing recurrence opens a choice and can harden into fatalism. **Question** · Can changing one turn reveal the difference between repetition and fate? **Close** · Notice where the loop rejoins.

#### 11 · Justice
- **Art** — Scales and upright sword. One red tally falls beyond the scale's ruled edge.
- **Reading** — **Archetype** · Judgment and accountability. **Morphystic** · Symbolic Consequence examines which costs the demiurgic field makes countable. **Intent** · Ask who bears the cost if the statement succeeds. **Tension** · A common measure makes accountability possible and hides particulars. **Question** · What would the balance register if the scale itself were on trial? **Close** · Include the unseen cost.

#### 12 · The Hanged Man
- **Art** — A hanged figure with crossed leg and a red halo. Inverted grid marks stay upright around the body.
- **Reading** — **Archetype** · Suspension and a changed vantage. **Morphystic** · PSM Inversion exposes a familiar angle as part of the constructed self-model. **Intent** · Try reading the wish with its presumed obstacle treated as a condition. **Tension** · A pause can change perspective or delay a decision indefinitely. **Question** · If an inversion still uses the same frame, what has actually moved? **Close** · Let the vantage shift.

#### 13 · Death
- **Art** — A skeletal rider bearing a white rosette crosses a break in the red loop. Faded impressions stop at the cut.
- **Reading** — **Archetype** · Endings and transformation. **Morphystic** · Loop Termination opens a reading of morphic reconfiguration through a discontinued form. **Intent** · Identify a role or habit whose ending would change the wish. **Tension** · Continuity protects a sense of self and can obstruct a real ending. **Question** · Who authorizes the end of the role that speaks the wish? **Close** · Name the pattern that can end.

#### 14 · Temperance
- **Art** — A winged figure pours a broken red stream between vessels, one foot in water and one on engraved stone.
- **Reading** — **Archetype** · Blending and adjustment. **Morphystic** · Entropy Modulation treats the interval between Forma Nihil and the mirror as a relation that can shift. **Intent** · Identify two pressures your statement holds in different proportions. **Tension** · Adjustment can preserve movement and postpone a necessary decision. **Question** · How much stability can a changing balance sustain? **Close** · Attend to the proportion.

#### 15 · The Devil
- **Art** — A horned figure above two loosely chained figures. The chain doubles as a red reward circuit.
- **Reading** — **Archetype** · Attachment and compulsion. **Morphystic** · The Dopaminergic Chain reads repeated reward as a form of binding. **Intent** · Name the reward you expect even before the outcome arrives. **Tension** · Pleasure can express a choice and make repetition feel inevitable. **Question** · How would you recognize an appetite that had learned to speak as freedom? **Close** · Examine the reward that renews the bond.

#### 16 · The Tower
- **Art** — Lightning unseats a crown. Two descending silhouettes are separated by a red fracture through the mirror masonry.
- **Reading** — **Archetype** · Upheaval and exposure. **Morphystic** · Symbolic Collapse reveals which supports were carrying the image of stability. **Intent** · Identify the structure your wish assumes will survive success. **Tension** · Collapse opens a view and can create a rush to rebuild the familiar. **Question** · What would count as learning from a structure you still want to inhabit? **Close** · Look at what the break exposes.

#### 17 · The Star
- **Art** — A kneeling figure pours water under an eight-point star. The red reflection reaches a crack in the rubble.
- **Reading** — **Archetype** · Hope and replenishment. **Morphystic** · The Post-Collapse Signal offers provisional orientation from within the breach. **Intent** · Look for a small sign that would make the aim worth pursuing again. **Tension** · Hope steadies attention and can make a preferred sign seem compulsory. **Question** · Can you follow a signal while allowing it to fade? **Close** · Keep the signal provisional.

#### 18 · The Moon
- **Art** — A path between towers, two disparate animals and a creature emerging from water. Its red shadow crosses the path at the wrong angle.
- **Reading** — **Archetype** · Uncertainty, dreams and projection. **Morphystic** · Ego Tunnel Shadows invite inquiry into what a borrowed identity makes feel familiar. **Intent** · Ask which part of the wish shelters you from uncertainty about yourself. **Tension** · Imagination can disclose what is missing and supply a premature explanation. **Question** · What would become possible if the shadow admitted two readings? **Close** · Leave the ambiguity visible.

#### 19 · The Sun
- **Art** — A rider and red banner below an oversized sun. Hard black hatching reveals the outline of the enclosure in full daylight.
- **Reading** — **Archetype** · Vitality and visibility. **Morphystic** · Total Clarity brings the contours of the prison into view. **Intent** · Ask what pursuing the aim publicly would disclose. **Tension** · Exposure aids understanding and can make visibility feel like the whole truth. **Question** · What remains outside a field flooded with light? **Close** · See what the light discloses.

#### 20 · Judgement
- **Art** — An engraved trumpet above rising figures. A red waveform fractures the last mirror across the middle of the plate.
- **Reading** — **Archetype** · Reckoning and response to a call. **Morphystic** · Final Rupture tests whether the mirror can break without erasing what it held. **Intent** · Name the past commitment the present wish asks you to answer for. **Tension** · A response can open change and repeat obedience to the familiar caller. **Question** · Who answers when the voice that summoned you may be your own? **Close** · Decide what deserves an answer.

#### 21 · The World
- **Art** — A dancer inside an ouroboros wreath with four witnesses at the corners. A red network is contained within the ring.
- **Reading** — **Archetype** · Completion and integration. **Morphystic** · The Network Trap asks what a complete system encloses before a return toward Forma Nihil. **Intent** · Consider what your fulfilled wish would make harder to leave. **Tension** · Belonging can complete a cycle and make an outside feel unthinkable. **Question** · Can a whole accommodate a genuine exit? **Close** · Look for the edge of completion.

## 6. Localization and Unicode

### What exists today

There is no Japanese translation system in this checkout. Searches of tracked files and locally available history found no locale catalogs, switches, Japanese strings or i18n dependency. The UI text and all reading content are embedded in `App.jsx`. The HTML shell declares `lang="en"` and UTF-8. UTF-8 lets the textarea receive Japanese and other scripts. The reducer filters those characters afterward. There is no existing locale architecture to extend, so the first step is to extract English strings. If a separate Japanese edition exists, obtain its source and reconcile existing copy and keys before translating the expanded edition.

### Verified reduction and Tarot examples

| Input | Legacy core | Legacy card | Why |
| --- | --- | --- | --- |
| `ab c a b c` | `ABC` | 6 The Lovers | First occurrences survive. |
| `日本語`, `Привет`, `ＡＢＣ`, `123!?` | `X` | 2 The High Priestess | Nonblank input with zero surviving ASCII letters. Full-width Latin fails the ASCII test. |
| `AЖB` | `AB` | 3 The Empress | Cyrillic Ж is discarded. |
| `Þ Æ Ö` | `X` | 2 The High Priestess | All three Icelandic forms fall outside A–Z. |
| `ÞÓR` | `R` | 18 The Moon | Only the ASCII R survives. |
| `Á` vs. `A` + U+0301 | `X` vs. `A` | 2 vs. 1 | No normalization precedes filtering. |
| `ß`, `ﬃ` | `S`, `FI` | 19, 15 | Uppercasing expands to `SS` and `FFI` before ASCII filtering and deduplication. |

### Catalogs and editorial workflow

- Use a single stable ID per card, a metadata manifest for image and audio references, and UTF-8 locale catalogs for `en`, `ja`, `ru` and `is`. Extract every visible string and accessibility string. Include mode/help text, validation, playable/unavailable audio, alt text, export controls and the HTML document language. A small dictionary loader can cover this app's first set of requirements.
- Keep legacy English as its own edition. Approve the 22 expanded English records and glossary, then translate the six fields per card, title, theme and art description into Japanese, Russian and Icelandic. Use native review for wording and line breaks, plus a separate check of Morphystic terms, symbolic voice and modality. Treat untranslated legacy text as English and mark its language when shown. Approve old-reading translations separately if requested.
- Define per-key English fallback for development and missing optional content. Validate that all required keys and 22 complete structured entries exist in every shipping locale. Maintain the chosen locale across phases. If it should survive reloads, persist the locale preference alone. Changing the interface language should update `document.documentElement.lang` and labels while keeping the current geometric result and card ID.
- Verify typography with kana and kanji, Cyrillic including Ё/ё, and the Icelandic accented alphabet including Þ/þ, Ð/ð, Æ/æ and Ö/ö. Check IME composition, Japanese breaks, long Russian labels, wrap at 320 CSS px, zoom and readable focus order. Select fonts by real glyph coverage and review licenses for any bundled font. Use Japanese system fallbacks or appropriately scoped subsets before adding a large CJK payload.

### Script-aware generation and resonance

**Token policy for Monogram.** Use NFC, stable script-aware case handling for supported cased alphabets and grapheme-aware segmentation. Keep Icelandic marks and distinct letters and Russian Ё distinct from Е. Keep kana voicing marks with their bases. Document an explicit width policy if users should get the same treatment for full-width and ASCII Latin. Use a targeted fold or a reviewed compatibility policy, since blanket NFKC also folds other forms. Exclude punctuation, digit-only and emoji-only content under the proposed letter-only mode with a localized explanation. Deduplicate normalized tokens for geometry, cap the amount processed, validate mixed-script inputs, and keep UI locale independent of input script. Use `Intl.Segmenter` or a tested fallback according to the supported browser range. If exact cross-version output matters for a script, version its segmentation data or specify the permitted token profile. [Unicode normalization](https://www.unicode.org/reports/tr15/), [Unicode text segmentation](https://www.unicode.org/reports/tr29/)

**Native forms and scope.** Translation and glyph fusion have different script coverage requirements. Phase in Latin/Cyrillic skeletons and then authored kana stroke templates. Kanji has a much larger inventory. A font can supply outlines, while ordered strokes and fusion anchors require further work. Pilot a limited kanji stroke dataset after license and coverage review, or provide a clear prompt for user-supplied kana or romanization whenever the entered characters lack Monogram shapes. Label any user-supplied alternative and let the user see what is used for forging. Mixed-script geometry should use known glyphs or request an explicit change. Modern text validation should avoid dropping unsupported letters silently. Japanese localization and script-aware resonance can ship independently of broad kanji geometry coverage.

**Selector decision.** Version Legacy as `ascii-sum-v1` and keep its 22 mappings. For the modern mode, prefer a documented deterministic local hash of the ordered normalized letter/grapheme sequence **before deduplication**, serialized unambiguously as UTF-8. Interpret a fixed portion of the digest as an unsigned value and reduce it modulo 22. Version normalization, serialization and hashing together and publish fixtures. Normalize equivalent spellings consistently under the chosen rules. Separate the resonance hash from geometry and variant seeds, so changing variants or UI locale never redraws a card. The same visible statement may receive a different card under the two algorithms. A translation of a statement supplies different input tokens, so the app should explain the resulting mapping and avoid promises of translation invariance.

Alphabet tables for Cyrillic and Icelandic could retain an A1Z26-like explanation, but would require defining mixed-script weighting and a separate approach for kana and kanji. Transliteration would require language-specific choices and can merge distinct spellings. A single versioned hash avoids assigning special numerical weights to writing systems and can run on-device without logging intent. It is a selection rule for reflection, independent of language understanding.

## 7. Proposed implementation order

| Order | Work | Completion condition |
| --- | --- | --- |
| 1 | Capture the Legacy baseline. Record exact readings and 22 card IDs, normalized text fixtures, expected drawing behavior under a stubbed random source, and root/subpath asset expectations. Patch the media path and low-risk usability issues as separate changes. | A tested build at root and a subpath, stable Legacy fixture results, and a preserved original manifest. |
| 2 | Extract plain data and engine functions from `App.jsx`. Separate input, forged result, resonance and audio/export lifecycle. Establish the catalogs and glossary in parallel with initial art direction. | Tests can call the algorithms without mounting React. The current flow can still be exercised end to end. |
| 3 | Prototype Monogram and modern resonance. Begin with Latin/Cyrillic, seeded geometry, intentionally short construction and SVG/PNG parity. Confirm the unsupported-script behavior and the scope for kana/kanji. | Review a representative fixture set for stroke ancestry, visual distinction, readable silhouette and repeatability. Users can explicitly select Legacy. |
| 4 | Review the six-field English drafts and the three art pilot plates. Then commission or produce the rest of the deck, review the audio set, and integrate the reveal and reading toggle. | 22 approved readings, 22 assets with documented rights, an accessible reveal and preserved original text. |
| 5 | Translate `ja`, `ru` and `is`, verify all 88 expanded card-locale records including English, and test browser/device and hosted builds. | Locale completeness, native review, passing compatibility tests and acceptable cold-load behavior. |
| 6 | Release from a repeatable CI build. If migrating CRA, do it in a separate change with the baseline tests as a gate. | A named Node version, repeatable static deployment and a reviewable diff for tooling, engines and content. |

Decisions to resolve before production are the Monogram default and fallback behavior, exact v2 resonance policy, the approved Morphystic glossary, source and rights for the illustrated deck and audio, and the actual deployment base path. Art and content review can start while the Legacy baseline is captured.

## 8. Dependencies, performance and risks

- **Toolchain.** CRA is in maintenance mode, and the installed React 18 major is behind the stable React 19 line. Keep React and the existing build initially to reduce variables during baseline capture. Consider Vite as a separate migration for this static app. Verify Node requirements, base-path support and equivalent test/lint scripts before switching. Refresh Browserslist data in a reviewed lockfile update and rerun the dependency advisory check with registry access. [React's CRA announcement](https://react.dev/blog/2025/02/14/sunsetting-create-react-app), [React 19.3 announcement](https://react.dev/blog/2026/09/09/react-19-3), [Vite guide](https://vite.dev/guide/)
- **Implementation dependencies.** SVG, Canvas 2D, CSS and browser audio can cover the initial scope. Add font or stroke assets only where they cover an approved script range and have usable redistribution terms. Add a library only for a measured gap such as consistent segmentation on a target browser or artwork path operations that exceed the prototype's scope.
- **Cold load and image budget.** The current JS baseline is 50.62 kB gzipped. Use it for comparison. Aim for a single selected card under roughly 150 kB at the typical viewport as a pilot budget, with responsive sizes and a fixed aspect ratio. Validate hatched line clarity after compression. Load the current locale and chosen image/audio on demand. Weigh extra locales and fonts against mobile transfers.
- **CPU and GPU.** Use finite stroke counts, bounded candidate search and on-demand PNG rasterization. Keep filter effects static and favor opacity and transform for the reveal. Profile one cold draw and repeated interactions on an ordinary phone. Use the profiler before adding a worker or layers. Check that reduced-motion, offscreen and idle screens have no unnecessary animation.
- **Rights, continuity and privacy.** The repository's code license does not document authorship or redistribution terms for the MP3s. Record provenance for shipped audio, art and fonts. Freeze Legacy behavior and approved copy with versioned fixtures. Keep raw intent and derived seeds in memory, and avoid logs, metadata or URLs that would expose intent when inspecting or exporting results.

## 9. Recommended testing strategy

| Layer | Coverage |
| --- | --- |
| Legacy algorithm | First-occurrence order, vowels, whitespace-only input, `X` fallback, uppercase expansions, min/max segments and both stroke styles. Prove all 22 card IDs and exact original texts with fixtures. |
| Modern algorithm | Normalization examples from §6, deliberate case and width policy, mixed scripts, combining marks, kana voicing, emoji, long inputs, empty inputs and unsupported characters. Use golden selection fixtures and verify repeatability across locales and variants. |
| Geometry and export | Use seeded examples with one letter, dense labels and accents. Assert that every retained glyph contributes geometry or connects to a shared stroke, bounds fit the frame, and repeat runs agree. Validate actual SVG parsing and PNG decode, dimensions, background, sizing, preview parity and absence of intent metadata. |
| Catalog and assets | Check full coverage and stable IDs for both editions. Verify all localized fields, language metadata, asset references and image/audio decoding. Flag missing entries and unintended duplicate cues. |
| Browser flow | Desktop Chromium, Firefox, and Safari/WebKit, plus a touch/mobile pass. Exercise reduction, cancel, forge, download, analyze, audio/mute, return and repeated transitions. Test a forced canvas failure, missing image/audio, audio denial, download handling and remount cleanup. Check real file creation and audible output. |
| Accessibility and visual review | Keyboard-only flow, focus handoff on each phase, screen reader labels, announcement of the selected card, Japanese IME, text expansion, zoom and narrow viewport. Test with reduced motion and verify thumbnail recognizability of each plate with its title covered. |
| Deployment and performance | Build from `npm ci` on the agreed Node version. Test a root static mount and project subpath with actual image/audio requests. Compare first and repeat reveal timings, bytes transferred, long tasks and dropped frames on a constrained mobile device. |

The simplest baseline browser smoke test is to enter `ab c a b c`, verify `ABC`, forge and open a downloaded 600 × 600 `sigil.png`, analyze for The Lovers and its cue, then return to a blank intent. Repeat with `V` to check The Fool and with `日本語` to document the current Legacy fallback. Capture the baseline before changing an algorithm or publishing new content.
