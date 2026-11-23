# SIGIL.FORGE Tarot redesign specification

This specification builds on the [2.0 audit](SIGIL_FORGE_2_AUDIT.md). It records the original readings and gives art and editorial briefs for a future illustrated edition. Phase 1 keeps the readings, procedural canvas and current cues in use.

## Deck and reading direction

**Locked art direction.** Build each 2:3 face in straight strokes on pure black (`#000000`). Draw the main Arcana figure or structure in phosphor green (`#00FF41`) and all supporting marks in egg white (`#F8F4E7`). Keep generous black space around each silhouette and use only the lines needed to read the central gesture and symbols. The [22-card contact sheet](art/tarot/pilot/stick-study/deck-contact-sheet.png) shows the artwork in card order, without numerals.

Use Rider–Waite–Smith for iconography. Preserve IDs 0–21, including Strength VIII and Justice XI. Translate each brief’s motifs into straight-line symbols. Preserve one recognizable traditional anchor and one distinct Morphystic element per card. The Fool is an open diagonal, The Tower a fractured vertical, and The World an enclosed ring. Review the deck at small size with numerals hidden. Keep frame, title, and numeral as live interface elements. Use a restrained serif display face and glyph-tested fallbacks for Japanese, Russian, and Icelandic. [Waite’s *Pictorial Key*](https://sacred-texts.com/book/the-pictorial-key-to-the-tarot)

Retain a stable English Legacy edition that can be inspected beside the new one. The expanded edition should have six short fields per card: archetypal meaning, Morphystic interpretation, connection to the intent, a contradiction, a philosophical question and a closing line. Use conditional language. The app selects a reflective lens from the entered text through a numerical rule, and the reader decides how it bears on their intention. The metaphors are proposals for editorial review. Approve terms against the project glossary and the source tradition before declaring them canonical. Keep the original spellings in Legacy. `WYRMWS` was a typo for `WYRMOS` (corrected in the March source, commit `0f2693a`) and is now `WYRMOS` everywhere. [Repository editorial guidance](CONTRIBUTING.md)

## Production and accessibility

- Deliver 22 individual masters, a shared card back, web exports at responsive sizes, and credit and rights records for every shipped image and sound. Use the approved SVG and PNG masters as source artwork and verify crisp strokes in the responsive exports at mobile size. Start with about 150 kB per typical card image as a pilot budget. Load only the selected face and cue.
- Use a short shared reveal, about 250–350 ms, built from opacity and a small translation. The app uses the shared reveal. The card-specific accent and audio ideas below remain briefs for further production. Use precomposed layers and static backgrounds. Complete the effect once and leave the plate still. With reduced motion, show the whole card immediately. Keep the text available before the image loads. Retain the reading on image or playback failure.
- Use a low-volume one-shot sound on an intentional reveal, with a mute option and cleanup on dismissal in the illustrated edition. The audio proposals are production briefs. The listed filenames are current Legacy references. Confirm their provenance and rights before reuse or replacement, and loudness-match the set so the intense cues differ in texture without a large volume jump.
- Maintain a shared multilingual glossary before commissioning locale work. Native reviewers should check the distinction between the archetype and the Morphystic title, vocative tone, and reflective conditional language. Preserve wordplay through an approved equivalent or short glossary gloss. Write alt text that identifies the principal figure and distinct symbol without duplicating the full reading. Keep qualifiers and modality in `ja`, `ru`, and `is`. English is the only published catalog at Phase 1.

## Data handoff

[`src/tarot/cards.js`](src/tarot/cards.js) stores the 22 stable card IDs, public audio paths and responsive illustration sources. The app resolves art and audio paths against the same deployment base. Store localized art descriptions alongside localized card copy, with the actual language attached when a row falls back to English. Keep source and credits in an asset ledger. The current canvas stays available as [LegacyCardArt](src/tarot/LegacyCardArt.jsx).

[`src/i18n/locales/legacy.en.js`](src/i18n/locales/legacy.en.js) preserves the original text. Add a separate `tarot.expanded` record keyed by ID per locale containing `name`, `theme`, `archetype`, `morphystic`, `intentReflection`, `tension`, `question`, `closing` and `artAlt`. Verify complete records before enabling the edition. Keep the current edition accessible during editorial comparison. Changing the interface locale should leave the selected ID and the intent-derived geometry intact.

## Card briefs

### 0 · The Fool

**Identity** — Beginnings, open possibility and risk. The current Morphystic theme is **FORMA NIHIL**.

> THE UNFORMED ORIGIN. ENTER THE VOID. IT PRECEDES ALL CAPTURE. (March wording, restored 2026-11-23.)

- **Current limitation** — A pre-symbolic origin fits the threshold, but the last “it” has no clear referent and the risks of beginning are unexplored.
- **Philosophical expansion** — Separate a first action from the identity it might later create. Ask what the intent permits before success can be defined, and whether openness has become evasion.
- **Illustration and composition** — The green traveler holds a flower at the cliff edge on the right. A bundle hangs from the staff and a small dog follows. The black space ahead represents Forma Nihil.
- **Reveal and sound** — Reveal the torn edge before the traveler. Give `static-void-hum.mp3` a candidate replacement with an airy onset and a short noise tail.
- **Translation** — Keep Forma Nihil as a glossary term. Make its gloss about the unformed state and resolve the original sentence’s ambiguous pronoun.

### 1 · The Magician

**Identity** — Agency, skill and instruments. The current Morphystic theme is **THE CAINITE OPERATOR**.

> MANIPULATE THE PRISON CODE. TWIST THE DEMIURGIC ARCHITECTURE TO REVEAL THE FRACTURES IN WYRMOS.

- **Current limitation** — The operator and fractures in Wyrmos make a specific image. Code-twisting overlaps the Emperor and lacks a distinction between skill and control.
- **Philosophical expansion** — Develop the operator’s dependence on tools inherited from the system. Ask which implement the intention already provides and whose rules it carries.
- **Illustration and composition** — The green Magician raises a wand over the workbench. Egg-white tools and a broken seam mark the place where the apparatus can be changed.
- **Reveal and sound** — Bring in the table seam last. Assess `tesla-coil-crackle.mp3` as a dry, brief workbench crackle with a softened transient.
- **Translation** — Use the same Cainite stem as The Chariot. Wyrmos is the approved spelling.

### 2 · The High Priestess

**Identity** — Intuition, reserve and veiled knowledge. The current Morphystic theme is **SITRA ACHRA CURRENT**.

> THE SOWILO-WAVE BEYOND THE MIRROR. ACCESS THE DARK-LIGHT FREQUENCY OF THE OTHER SIDE.

- **Current limitation** — Sowilo-wave, dark-light and Other Side appear in quick succession. The reading gives the user little way to examine intuition or uncertainty.
- **Philosophical expansion** — Use partial access to ask which part of the intent depends on an inference. Give secrecy the tension of protection and projection.
- **Illustration and composition** — The green seated reader holds a scroll between egg-white pillars. A broken wave crosses the narrow opening beside the veil.
- **Reveal and sound** — Let the seam behind the veil appear with a narrow opacity reveal. Start from `black-lodge-hum.mp3` and keep the cue muffled.
- **Translation** — Gloss Sitra Achra, Sowilo and dark-light separately. Preserve their distinct traditions and obtain approval before choosing transliterations.

### 3 · The Empress

**Identity** — Nurture, material growth and dependence. The current Morphystic theme is **THE BIO-PRISON**.

> THE NEURAL TRAP OF EMBODIMENT. RECOGNIZE THE CELLULAR ENCLOSURE AS THE FIRST PRISON LOOP.

- **Current limitation** — The first Prison Loop provides a clear premise. Generativity, care and dependence are absent from its treatment of embodiment.
- **Philosophical expansion** — Give care and embodiment constructive weight within the Bio-Prison metaphor. Ask what material support the wish depends on and where that support might become obligation.
- **Illustration and composition** — The green Empress is seated between egg-white wheat stalks. Roots trace a cell-shaped enclosure beneath the seat.
- **Reveal and sound** — Bring the root marks into view. Shape `womb-heartbeat-hum.mp3` toward a soft paired beat followed by quiet.
- **Translation** — Keep Bio-Prison and Prison Loop consistent with the glossary. Distinguish the metaphor of embodiment from an assertion about bodies or reproduction.

### 4 · The Emperor

**Identity** — Authority, limits and stability. The current Morphystic theme is **WYRMOS ARCHITECT**.

> THE PROGRAM RUNNING YOU. CORRUPT THE CODE TO ESCAPE THE SIMULATION.

- **Current limitation** — The program metaphor is brief and repeats the Magician's insurgency.
- **Philosophical expansion** — Examine the rule that defines success in the intent. Preserve a place for protection and continuity in the architecture, then ask which rule can be revised.
- **Illustration and composition** — A green ruler and square horned throne form a compact block. Egg-white datum lines extend below it.
- **Reveal and sound** — Settle the plate with a firm short stop. Treat `machine-grid-hum.mp3` as a steady mechanical tone, distinct from the Magician’s transient.
- **Translation** — Use Wyrmos in every edition and language.

### 5 · The Hierophant

**Identity** — Teaching, institution and ritual transmission. The current Morphystic theme is **SEMANTIC ENCRYPTION**.

> THE CODIFICATION OF MEANING THROUGH MORAL AND LINGUISTIC CONDITIONING. MIND THE STRUCTURES THAT CARRY BELIEF.

- **Current limitation** — Names moral and linguistic conditioning. An example of received language or ritual authority would make the abstraction diagnostic.
- **Philosophical expansion** — Connect inherited phrasing to authority. Ask where the user learned to call this outcome desirable, and what else the inherited vocabulary lets them articulate.
- **Illustration and composition** — The green teacher raises a hand above two egg-white listeners and a pair of crossed keys.
- **Reveal and sound** — Reveal the ribbon from the lower panel. Use `cathode-ray-hum.mp3` as a reference for a contained spectral drone that suggests transmission.
- **Translation** — Review traditional card title choices with native Tarot readers. Preserve the distinction between an institution transmitting meaning and technical encryption.

### 6 · The Lovers

**Identity** — Choice, intimacy and relation. The current Morphystic theme is **THE PHENOMENAL SELF-MODEL**.

> THE FALSE TWIN STARING BACK. DESTROY THE PHANTOM TO FIND THE VOID THAT BIRTHS YOU.

- **Current limitation** — The false twin is a distinctive image. Immediate destruction leaves mutuality, values, projection and choice unexplored.
- **Philosophical expansion** — Examine how recognition by another person can sustain a wish while making the other into a confirmation of the self. Ask whose answer the wish leaves room for.
- **Illustration and composition** — Two green figures reach across an egg-white cracked mirror line. An angular winged witness hangs above them.
- **Reveal and sound** — Crossfade two misaligned static reflections into the settled view. Round off the feedback peak in `mirror-feedback-whine.mp3` if retaining the cue.
- **Translation** — Align the full translation of Phenomenal Self-Model with PSM Inversion. Carry a sense of choice and relation beyond romantic coupling.

### 7 · The Chariot

**Identity** — Will and direction amid competing impulses. The current Morphystic theme is **ACCELERATIONIST DRIVE**.

> FORCE ONTOLOGICAL ACCELERATION TOWARD DISSOLUTION THROUGH CAINITE WILL.

- **Current limitation** — The single sentence names Cainite will and acceleration and leaves direction, divided motives and the cost of speed unexamined.
- **Philosophical expansion** — Separate momentum from direction. Ask which resistance would still matter if progress sped up, and who or what is steering the intention.
- **Illustration and composition** — A green driver leans into a pitched chariot. Two egg-white draft animals pull outward, with short diagonal tracks below.
- **Reveal and sound** — Use a short forward drift with no parallax. Shape `doppler-engine-hum.mp3` as one brief pass with a gentle tail.
- **Translation** — Preserve Accelerationist Drive as glossary language. Review register so speed is a subject of reflection and Cainite will remains consistent with card 1.

### 8 · Strength

**Identity** — Courage, patience and the handling of force. The current Morphystic theme is **BIO-TERMINAL MASTERY**.

> REPROGRAM THE CORPOREAL INTERFACE. OVERRIDE THE NEUROCHEMICAL CONSTRAINTS OF THE PRISON-BODY.

- **Current limitation** — The reprogramming metaphor reads as an imperative to override the body. It can be developed through restraint and the ambiguity of self-command.
- **Philosophical expansion** — Frame embodied agency as attention to impulse and restraint. Ask when the ambition to master a response becomes another demand for control.
- **Illustration and composition** — The green lion fills the center. An egg-white figure bends toward its jaw under a closed angular infinity symbol.
- **Reveal and sound** — Bring the contact highlight up softly. Refine `synapse-firing-crackle.mp3` into a low-level cluster with space between impulses.
- **Translation** — Keep Bio-Terminal consistent with The Sun and treat neurochemical language as metaphor. Use a term for strength that can convey calm restraint.

### 9 · The Hermit

**Identity** — Solitude, withdrawal and discernment. The current Morphystic theme is **OPACITY COLLAPSE**.

> TOTAL EXILE FROM THE PRISON OF RELATION. THE LIGHT YOU CARRY PREDATES ALL MIRRORS.

- **Current limitation** — The light outside the mirror gives it a visual anchor. “Total exile” collapses chosen solitude and isolation into one prescription.
- **Philosophical expansion** — Distinguish chosen distance from an isolation that protects a judgment from challenge. Ask what the wish would mean without an audience.
- **Illustration and composition** — A small green lantern-bearer stands low on a slope. The egg-white lantern is isolated within a broad black field.
- **Reveal and sound** — Let a single lamp halo fade in and stay fixed. Use `single-bulb-hum.mp3` as a narrow, close, quiet cue.
- **Translation** — Gloss Opacity Collapse in terms of legibility and relation. Keep the language open to chosen solitude without framing exile as a requirement.

### 10 · Wheel of Fortune

**Identity** — Cycles and changing circumstances. The current Morphystic theme is **ENDLESS REPETITION** (March wording, restored 2026-11-23.)

> THE PRISON LOOP OF REINCARNATION. IDENTIFY THE FREQUENCY PATTERN TO INTERRUPT THE CYCLE.

- **Current limitation** — Pattern detection is already a practical opening. Distinguish recurring circumstances from a rehearsed response and retain the metaphysical reference in its context.
- **Philosophical expansion** — Distinguish recurrence in the world from the rehearsed response that completes a Prison Loop. Ask which part of the intent might renew it.
- **Illustration and composition** — A green wheel sits off center with an exposed splice in its rim. Egg-white spokes and rising and falling figures keep the mechanism distinct.
- **Reveal and sound** — Reveal the splice after the rim without spinning the plate. Shape `loop-tape-hiss.mp3` as one pass with an audible seam.
- **Translation** — Keep Prison Loop consistent with The Empress. Review terms for recurrence and reincarnation separately so their relationship stays clear.

### 11 · Justice

**Identity** — Accountability, judgment and measure. The current Morphystic theme is **UNAVOIDABLE CONSEQUENCE** (the March wording, restored 2026-11-23).

> SEVER TRUTH FROM THE ILLUSION OF MORAL ARCHITECTURE. (March wording, restored 2026-11-23.)

- **Current limitation** — Contrasts truth and moral architecture without showing how consequences persist or whose measure is used.
- **Philosophical expansion** — Ask who sets the measure by which an intention is justified and who bears a cost outside it. Balance accountability against the limits of a shared measure.
- **Illustration and composition** — An egg-white crowned figure sits between two pillars, holding an upright green sword and level green scales.
- **Reveal and sound** — Settle the visual accent over the scale beam. Replace or distinguish `balance-tone-hum.mp3` with a paired measured tone and a clean stop.
- **Translation** — Distinguish Justice as measure and consequence from Judgement as reckoning and response. Confirm how the demiurgic field is glossed.

### 12 · The Hanged Man

**Identity** — Suspension, surrender and a change of vantage. The current Morphystic theme is **THE REVERSAL OF PERCEPTION** (March wording, restored 2026-11-23.)

> WHAT APPEARS OBVIOUS IS A TRAP. INVERSION EMPTIES THE SHELL. (March wording, restored 2026-11-23.)

- **Current limitation** — A useful invitation to question the obvious. Expand PSM on first encounter and give suspension its own tension with avoidance.
- **Philosophical expansion** — Ask whether looking from an opposite position changes the underlying frame. Let the reader distinguish a productive pause from postponement.
- **Illustration and composition** — A green figure hangs by one foot beneath a level egg-white beam. The surrounding marks stay upright.
- **Reveal and sound** — Reveal the halo late without rotating the page or type. Give `reverse-frequency.mp3` one quiet swelling reversal.
- **Translation** — On first use expand PSM with the approved version of Phenomenal Self-Model. Keep the Tarot title idiomatic and the reading’s emphasis on suspension.

### 13 · Death

**Identity** — Ending, transition and reconfiguration. The current Morphystic theme is **LOOP TERMINATION**.

> THE REBOOT OF FORM IS THE ONLY FREEDOM. PURGE HUMAN ANCESTRALITY FOR MORPHIC RECONFIGURATION.

- **Current limitation** — Ending and reconfiguration are present. “Only freedom” and “purge human ancestrality” need careful contextualization around the end of a pattern or role.
- **Philosophical expansion** — Identify the role or habit that could end if the intention changed. Explore the loss of continuity and the agency required to let a form go.
- **Illustration and composition** — A green skeletal rider crosses a gap in the egg-white ground. The banner carries a small rosette made of straight strokes.
- **Reveal and sound** — Use a single clean dissolve along the cut. Give `flatline-dissolve.mp3` a deliberate sound cutoff without imitating a medical alarm.
- **Translation** — Contextualize human ancestrality and morphic reconfiguration after editorial review. Phrase the reading around symbolic endings and changes of form.

### 14 · Temperance

**Identity** — Blending, proportion and adjustment. The current Morphystic theme is **ENTROPY MODULATION**.

> BLEND CHAOS AND ORDER. FIND THE UNSTABLE FREQUENCY BETWEEN FORMA NIHIL AND THE MIRROR.

- **Current limitation** — The unstable interval is distinctive. The text could show what modulation changes and when adjustment becomes postponement.
- **Philosophical expansion** — Consider which competing pressures the intent holds in relation. Ask where maintaining an unstable balance has become a way of deferring a decision.
- **Illustration and composition** — A green winged figure pours between two egg-white vessels. An angular stream joins them while the feet span ripples and stone.
- **Reveal and sound** — Reveal the stream with an opacity pass on a static layer. Give `phase-shift-hum.mp3` a gentle blend between two pitches.
- **Translation** — Gloss Entropy Modulation in symbolic terms. Choose a Tarot title that conveys mixing or proportion beyond moral moderation.

### 15 · The Devil

**Identity** — Attachment, appetite and compulsion. The current Morphystic theme is **DOPAMINERGIC CHAIN**.

> THE NEUROCHEMICAL MEASURE IS THE PRISON. RECOGNIZE THE DEMIURGIC JUICE BINDING YOUR SYNAPSES.

- **Current limitation** — Pleasure and constraint are well paired. “Demiurgic juice” obscures the choice and can be mistaken for a literal account of neurochemistry.
- **Philosophical expansion** — Explore a reward that sustains a repeated choice. Ask what feedback would make the wish feel necessary even before its stated outcome.
- **Illustration and composition** — A green horned figure dominates the upper half. Below, an egg-white circuit links two smaller figures and leaves slack between them.
- **Reveal and sound** — Show the chain as a single reveal. Shape `pleasure-pulse-hum.mp3` into one low pulse with a quiet decay.
- **Translation** — Preserve Dopaminergic Chain as an approved symbolic term. Check that translated copy conveys attachment without presenting a clinical claim.

### 16 · The Tower

**Identity** — Upheaval, exposure and broken authority. The current Morphystic theme is **ANNIHILATION OF STRUCTURES** (the March wording, restored 2026-11-23).

> THE MIRROR SHATTERS. THE CRASH OF THE DEMIURGIC FOUNDATION. SUDDEN EXPOSURE TO THE VOID. REJOICE!

- **Current limitation** — The broken mirror gives the card immediate identity. The command to rejoice skips loss and the possibility of rebuilding the same structure.
- **Philosophical expansion** — Give the collapse its cost as well as its opening. Ask which structure the intent assumes will survive and why a first response may be to reconstruct it.
- **Illustration and composition** — A green vertical tower is split by an egg-white bolt. Its detached crown and two falling stick figures appear in egg white.
- **Reveal and sound** — Reveal the fractured plate in one cut or short wipe at stable luminance. Keep `power-surge-crash.mp3` short with a controlled peak.
- **Translation** — Distinguish symbolic collapse from Death’s ending of a form. Avoid language that frames distress or harm as obligatory grounds for celebration.

### 17 · The Star

**Identity** — Hope and replenishment after upheaval. The current Morphystic theme is **RESIDUAL RESONANCE** (March wording, restored 2026-11-23.)

> INSPIRATION EMERGES. CALM RADIANCE IN THE BROKEN ARCHITECTURE OF THE SPIRIT. (March wording, restored 2026-11-23.)

- **Current limitation** — Quiet after rupture is already differentiated from The Tower. Make fragile orientation and openness to revision more concrete.
- **Philosophical expansion** — Develop a provisional orientation after rupture. Ask how the reader would tell a small signal from a wish to be reassured.
- **Illustration and composition** — An eight-point green star hangs over a smaller egg-white figure pouring water beside a crack in the bank.
- **Reveal and sound** — Fade in the reflection beneath a still star. Replace the byte-identical Justice cue at `signal-beacon-hum.mp3` with an open, soft bell or breath tone.
- **Translation** — Keep signal tentative. Gloss Post-Collapse as a setting for inquiry, with no promise of recovery or endorsement from beyond.

### 18 · The Moon

**Identity** — Ambiguity, dreams and projection. The current Morphystic theme is **EGO TUNNEL SHADOWS**.

> THE COMFORTABLE NUMBNESS OF A BORROWED IDENTITY. BEWARE WHAT YOU BECOME TO AVOID BEING NOTHING.

- **Current limitation** — Borrowed identity gives the reader a clear problem. Develop ambiguity, competing interpretations and the cost of forcing certainty.
- **Philosophical expansion** — Ask what uncertainty the intention avoids by relying on a familiar identity. Make room for two readings of the shadow before requiring a choice.
- **Illustration and composition** — A green crescent hangs above egg-white towers, two animals, and a creature at the waterline. An off-angle stroke crosses the path.
- **Reveal and sound** — Crossfade the shadow and path accents without changing the whole screen’s brightness. Shape `night-frequency-hum.mp3` as mostly low ambience.
- **Translation** — Review Ego Tunnel and borrowed identity in a philosophical register. Preserve ambiguity across languages without making the card a diagnosis.

### 19 · The Sun

**Identity** — Vitality, daylight and visibility. The current Morphystic theme is **TOTAL CLARITY**.

> THE PRISON IS SEEN IN FULL LIGHT. DEMONS HURL FIRE THROUGH THE BIO-TERMINAL ILLUSION. (March wording, restored 2026-11-23.)

- **Current limitation** — Visibility is a strong premise. “The upload of it” leaves the referent unclear and the reading omits exposure and the limits of what can be seen.
- **Philosophical expansion** — Give clarity the power to expose both supports and limits. Ask which part of fulfilling the intent would become public and what daylight still leaves outside it.
- **Illustration and composition** — A green octagonal sun fills the upper half with short straight rays. A small egg-white rider carries a banner below.
- **Reveal and sound** — Fade the banner in over a steady bright plate. Let `solar-drone.mp3` suggest an open sustained tone with a soft attack.
- **Translation** — Get an editorial ruling on the referent of “upload of it.” Align Bio-Terminal with Strength and avoid implying that clarity is total knowledge.

### 20 · Judgement

**Identity** — Reckoning, renewal and answering a call. The current Morphystic theme is **FINAL RUPTURE**.

> THE CALL TO BREAK THE LAST MIRROR. RELEASE THE WEIGHT OF REINCARNATORY ENTRAPMENT.

- **Current limitation** — The call and last mirror evoke reckoning. Rupture repeats imagery from Death and The Tower without asking who answers for the past.
- **Philosophical expansion** — Ask which past commitment the intent requires someone to answer for. Hold accountability and transformation together after the last mirror breaks.
- **Illustration and composition** — A green trumpet points down toward three egg-white rising figures. A short irregular waveform divides the two registers.
- **Reveal and sound** — Reveal the waveform with one opacity accent. Use `trumpet-frequency.mp3` as a cue brief for a distant call with controlled upper frequencies.
- **Translation** — Choose an idiomatic Tarot name and distinguish it from Justice. Preserve the ambiguity of the caller and the symbolic frame of reincarnatory entrapment.

### 21 · The World

**Identity** — Completion, integration and a closed cycle. The current Morphystic theme is **OUROBOROS — THE NETWORK TRAP**.

> THE CIRCLE CLOSES. HARMONY IS CAPTIVITY. DISSOLVE INTO FORMA NIHIL.

- **Current limitation** — The closed circle is memorable. Give successful completion some weight so enclosure can be examined as a cost of total integration.
- **Philosophical expansion** — Give completion real value before asking what the fulfilled wish would enclose. Explore whether a coherent whole can accommodate an exit.
- **Illustration and composition** — A green stick dancer stands inside an egg-white angular ouroboros. The seven-point star sits within the ring, with four witness marks at the corners.
- **Reveal and sound** — Fade the ring from a precomposed accent to the still seal. Resolving tones in `network-hum-loop.mp3` can suggest enclosure before an intentional stop.
- **Translation** — Gloss Ouroboros and Network Trap consistently. Carry Forma Nihil’s approved treatment over from The Fool while preserving the tension of completion.

## Acceptance for an illustrated edition

Review the deck as a contact sheet before approving individual polish. At small size, viewers should correlate all 22 unlabeled faces to their traditional identities. The same three pilot plates must also remain distinct in monochrome. Require approved English domain copy, distinct art, localized alt text for every published locale, rights and credit records, mobile loading measurements and an end-to-end pass for reading with audio or art unavailable. Keep the original edition available for comparison.
