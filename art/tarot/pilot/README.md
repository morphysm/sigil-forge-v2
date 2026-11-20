# Tarot pilot art

The user approved the design direction in [TAROT_REDESIGN_SPEC.md](../../../TAROT_REDESIGN_SPEC.md). These three illustrations test an open diagonal, a fractured vertical, and a closed circle before the style is applied to the full deck.

The artwork was generated with the built-in ImageGen tool on 20 November 2026 using the original briefs below. No reference image was supplied. The 1024 × 1536 PNGs are the untouched generation masters. ImageMagick produced the responsive WebP copies used by the app.

| Card | Master | App copies |
| --- | --- | --- |
| The Fool | [Master](fool.png) | [420 px](../../../public/tarot/pilot/fool-420.webp), [600 px](../../../public/tarot/pilot/fool-600.webp) |
| The Tower | [Master](tower.png) | [420 px](../../../public/tarot/pilot/tower-420.webp), [600 px](../../../public/tarot/pilot/tower-600.webp) |
| The World | [Master](world.png) | [420 px](../../../public/tarot/pilot/world-420.webp), [600 px](../../../public/tarot/pilot/world-600.webp) |

The [contact sheet](contact-sheet.png) shows the 420 px exports reduced to 120 × 180 px, in color and monochrome. The phone-sized exports are about 36–89 kB. The larger versions are about 72–172 kB. Judge The World’s fine hatching at the intended display size before using that level of detail throughout the deck.

## Generation prompts

### The Fool

> Use case: illustration-story. Create one original full-bleed portrait illustration for SIGIL.FORGE, a 2:3 Tarot card plate. German Expressionist woodcut with the sharp scooped cuts of historical relief printing, selective occult copperplate hatching, dense carbon black, aged pale bone paper and ONE restrained dried vermilion ink accent. Bold distinct graphic silhouette and readable at a tiny 120 px thumbnail, uneven print texture, high-contrast black masses alternating with clear paper openings. Flat scanned ink-on-paper impression, no mockup, no frame, no titles, no numerals, no text, no lettering. Keep important symbols clear of the outer 5% for layout. Avoid fantasy digital-painting polish, lens effects and gradient lighting. The Fool, Forma Nihil. The dominant shape is an OPEN RISING DIAGONAL. A traveler with staff and small tied bundle strides at the brink of a torn-looking cliff from the lower left. There is a small dog at their heels. Their next step points upward and right into a great unmarked pale void. Rough-cut black earth occupies the lower-left triangular wedge. A thin vermilion cut edges the precipice. The large empty top right is essential, with no sun, clouds or stars. Clear profile pose and separate small dog silhouette.

### The Tower

> Use case: illustration-story. Create one original full-bleed portrait illustration for SIGIL.FORGE, a 2:3 Tarot card plate. German Expressionist woodcut with the sharp scooped cuts of historical relief printing, selective occult copperplate hatching, dense carbon black, aged pale bone paper and ONE restrained dried vermilion ink accent. Bold distinct graphic silhouette and readable at a tiny 120 px thumbnail, uneven print texture, high-contrast black masses alternating with clear paper openings. Flat scanned ink-on-paper impression, no mockup, no frame, no titles, no numerals, no text, no lettering. Keep important symbols clear of the outer 5% for layout. Avoid fantasy digital-painting polish, lens effects and gradient lighting. The Tower, Symbolic Collapse. The dominant shape is a FRACTURED VERTICAL. A tall dark masonry tower stands upright in the center, its crown thrown sideways at the top by a narrow jagged flash. One deep vermilion break splits the tower's near face from crown to base, exposing a mirror-like cleft. Two small human silhouettes descend outside it on opposite sides, separated from the few blocks of debris. Black sky with a few coarse engraved cuts. Keep the lightning and crown distinct at thumbnail size.

### The World

> Use case: illustration-story. Create one original full-bleed portrait illustration for SIGIL.FORGE, a 2:3 Tarot card plate. German Expressionist woodcut with the sharp scooped cuts of historical relief printing, selective occult copperplate hatching, dense carbon black, aged pale bone paper and ONE restrained dried vermilion ink accent. Bold distinct graphic silhouette and readable at a tiny 120 px thumbnail, uneven print texture, high-contrast black masses alternating with clear paper openings. Flat scanned ink-on-paper impression, no mockup, no frame, no titles, no numerals, no text, no lettering. Keep important symbols clear of the outer 5% for layout. Avoid fantasy digital-painting polish, lens effects and gradient lighting. The World, Ouroboros and the Network Trap. The dominant shape is a CLOSED CIRCLE. A thick black ouroboros wreath forms one closed ring, with the snake biting its tail visibly. Within it a central dancer with a billowing cut-paper drape and poised limbs stands apart from a restrained vermilion network of linked nodes. Keep the network strictly inside the ring. Four small distinct engraved witness heads (human, eagle, lion, bull) occupy the outside corners. The circle has a clear uninterrupted silhouette and a visible bone-paper band inside it.

## The World film-plate variant

[The World film plate](world-film-v2.png) is a 1024 × 1536 candidate made with the built-in ImageGen tool. The edit uses the original World plate as a composition reference. A second pass used a seven-node geometric guide to correct the star behind the dancer.

### Film-plate prompt

Use case: style-transfer. Edit the supplied portrait illustration of The World for SIGIL.FORGE. Return one full-bleed 2:3 portrait plate. Preserve the original crop, the dancer's silhouette and flowing drapery, the closed ouroboros biting its tail, the carved gouge marks and the four corner heads in their places: upper-left human, upper-right eagle, lower-left lion, lower-right bull.

Change the medium to a flat relief print on exposed black cellulose acetate, seen from directly above on a light table. Deep smoky black celluloid ground (#0A0B0A) with faint backlight showing through thinner emulsion. Fine vertical scratches, small dust specks, hairline emulsion cracks, minimal edge fog, light grain, and faint film perforations along the far left margin only. The film is the dark image background, no surrounding scene.

Register exactly three inks. Phosphor green #3CFF6A goes only on the carved dancer and the snake ring, with a slight soft CRT P1 halo that leaves the woodcut cuts sharp. Matte antique metallic gold #C9A227 goes only on the network behind the dancer. Replace the source network with a true seven-point heptagram. Exactly seven visible round gold nodes, one at each of the points of a regular heptagon with a point at twelve o'clock. Connect each point to the point three positions ahead using a single straight narrow gold segment. The dancer can occlude the middle segments but all seven tips must be individually visible around her. No gold dots at crossings, no circular gold outline, no rim polygon, no eighth node. Burnt red #8B2A14 goes only on the four corner heads and their carved lines. Use dark oxidation, never orange.

Keep the original woodcut and flat print registration. The engraved lines appear to emit light from the film itself, with very restrained halation. Exclude beige, parchment, paper fibers, sepia, a white background, cyberpunk, neon cities, chrome, lens flare, gradient backgrounds, bright orange, magenta, text, numerals, lettering and watermarks.

### Heptagram correction prompt

Use case: precise-object-edit. Image 1 is the edit target, the approved-looking green/red relief-print film Tarot plate. Image 2 is a precise geometry guide and alignment reference for the gold ink only. Edit just the GOLD network inside the green ring.

Erase the entire old gold network (including the old two diagonal bars that form a V under the foot). Register all seven gold lines and exactly seven gold circles from Image 2 at the same plate coordinates, behind the original green dancer so her existing figure can mask lines that pass under it. The correct silhouette of tips is one top dot, two high shoulder-level dots, two outer hip-level dots, and two low dots to the sides of the calf. The two low dots are at equal height and separated by a black gap below the calf; there is no dot or V point in the bottom center. Keep the true seven-point {7/3} heptagram shown in Image 2. Translate the guide's solid marks into matte, finely etched #C9A227 gold ink. Use the image 1 background, not the guide background.

Preserve image 1’s identical edges, central dancer pose, green woodcut highlights, ouroboros, the four burnt-red corner heads, scratches, one perforated margin, film black and tightly restrained phosphor glow. No text, no new objects. Full portrait frame.

## The World biomechanical scratch-film variant

[The World biomechanical film plate](world-film-v3.png) is a 1024 × 1536 edit of the film plate, made with built-in ImageGen. It keeps the seven-node heptagram and works vertebral ribs and tubular channels into the green cloth and serpent.

### Edit prompt

Edit the supplied 2:3 Tarot card as a hand-worked scratch-film relief print. Retain the exact overall layout: a clothed adult dancer flowing through a green ouroboros ring, the existing matte gold heptagram with all seven round nodes, and four corner portraits (human, eagle, lion, bull). Preserve the dance pose and give the costume clear draped fabric over the torso and hips.

Change the surface detail of the green CLOTH and green SERPENT only. Some raised cloth folds turn into rows of incised ribs and soft, narrow parallel tubes that arc back into flowing fabric. The serpent still bites its tail; its body now alternates recognizable scales with ridged backbone-like segments and bundled channels, all scratched in flat phosphor-green linework. Make the tapering hand-etched marks and irregular rhythmic gouges look like direct animation drawn onto film emulsion, with soft, restrained halation at the brightest cuts.

Keep the existing matte gold (#C9A227) star and its seven nodes as they are. Keep the four corner heads burnt oxidized red (#8B2A14). Preserve the smoky black (#0A0B0A) acetate, backlit fine vertical scratches, dust, hairline emulsion cracks, and one line of left-edge sprocket holes. Green ink is #3CFF6A and reserved for the dancer and ring. Use flat registration and two-tone scratched strokes. No text, paper, beige, sepia, airbrush shading, chrome, cyberpunk city elements, magenta or bright orange.

## The World full biomechanical variant

[The World biomechanical plate](world-biomechanical-v4.png) is a 1024 × 1536 edit of the scratch-film variant, made with built-in ImageGen. Its mechanical anatomy extends across the dancer, ouroboros and four witnesses, with the gold heptagram retained.

### Full biomechanical edit prompt

Edit the supplied portrait Tarot card The World into a fully biomechanical relief print on backlit black acetate. The edit must be a substantial visual change: build the whole scene out of intertwined organ-like machinery and skeletal industrial forms while retaining its exact composition, orientation and three ink separations.

Center: keep the same pose of the fully clothed adult dancer with a readable face, hands, and foot. Her sweeping garment is constructed from overlapping ribbed plates, flexible bellows and bundles of curved tubes, layered to read as flowing drapery. The surfaces are flush and sculptural; the tubular forms turn naturally with the cloth. Engrave the face and visible limbs with a few fine mechanical seams. Around her, keep a single large ouroboros loop with a recognizable serpent's head visibly biting its own tail. Rebuild the ring almost entirely as repeating articulated vertebrae, interlocking rib cages, paired conduits, and deep black slots. Avoid ordinary snake scales as the main texture.

Keep the four corner motifs, all recognizable instantly: human upper left, eagle upper right, lion lower left, bull lower right. Rework each face as a distinct biomechanical portrait with fine ribbed cheek plates or jaw hinges, tubular channels and carved sockets. Keep the eagle's beak, the lion's mane and the bull's horns strong at thumbnail size. Keep the existing thin matte-gold heptagram and exactly seven visible round gold nodes in the same positions behind the dancer. Do not draw a new path or extra nodes.

Strict ink registration: phosphor green #3CFF6A for dancer and ouroboros; matte antique gold #C9A227 for the heptagram and its seven nodes only; burnt oxidized red #8B2A14 for the four corner portraits only. Smoky celluloid ground #0A0B0A, fine vertical scratches, light dust and emulsion cracks, faint perforations on the far left edge only. Print the surfaces with etched hatching and deep cut shadows. A restrained green halo makes the cuts glow. No parchment, grey-sepia airbrush, polished chrome, cyberpunk setting, gradients, magenta, orange, lettering or watermarks. Maintain the full-bleed 2:3 crop.

## The World painterly reference variant

[The World painterly plate](world-painterly-v5.png) is a 1024 × 1536 built-in ImageGen edit. The biomechanical plate supplied the layout. The user’s [painting reference](<tries_&_references/inspire_tarot.jpg>) supplied the oil texture, storm-dark values and raking light. This was the working direction during the painted pilot. Its app-sized copies are the [420 px](../../../public/tarot/pilot/world-painterly-420.webp) and [600 px](../../../public/tarot/pilot/world-painterly-600.webp) exports. The contact sheet above records the first pilot set.

### Reference-guided edit prompt

Use case: reference-guided style transfer for The World Tarot illustration, portrait 2:3. Image 1 is the composition and geometry reference only. Image 2 is the painting and lighting reference only. Repaint the entire card from Image 1 as a dark figurative oil painting with the tactile brushwork, storm-dark value structure, worn dark rock surfaces, and dramatic directional light of Image 2. Keep the card composition and identities, and use an original interpretation of the reference's visual treatment.

Maintain a clear central adult dancer, fully clothed in heavy flowing drapery, with the original upturned face, one arm reaching left and one raised. Model living anatomy and substantial folds in oil paint using a narrow band of warm ivory light against broad near-black shadow. Make her costume subdued ivory and weathered olive, with only a trace of green patina. The massive ouroboros must remain a complete and unmistakable enclosing ring with its head biting its own tail near the top. Paint it as a living, stone-dark, weathered verdigris serpent with worn matte scales, warm raking light on edges and deep recesses. Keep the four heads distinct and in their fixed positions: human top left, eagle top right, lion bottom left, bull bottom right. Paint them as monumental old relief sculptures emerging from dark rocks, with muted oxblood accents and lamp-lit edges.

Retain the gold star geometry of Image 1 behind the dancer, with exactly seven visibly countable round matte tarnished-gold nodes in their original positions: one high central, two near the shoulders, two toward the middle outer sides, and two lower nodes to either side of her calf. No additional node or V-shaped point at the foot. Keep the star thin, subtle and readable against the shadows.

Use the second image's slate-blue and charcoal atmosphere, slightly weathered oil surface, rough dark rock shapes, localized warm ivory highlights, and a small restrained ember red accent. Allow painterly forms to disappear at the margins into shadow, but keep the ring and corner faces readable at thumbnail size. No neon, machine hardware, sci-fi plating, film sprocket holes, printed hatching, luminous outlines, parchment, lettering, numerals, frame, or watermark. Preserve full-bleed portrait proportions.

## The Fool and The Tower painted pilots

The built-in ImageGen tool used each original plate for composition and the approved World painting for style. The 1024 × 1536 PNGs are the generation masters. The [painted contact sheet](painterly-contact-sheet.png) shows the three plates in color and monochrome at 120 × 180 px.

| Card | Master | App copies |
| --- | --- | --- |
| The Fool | [Master](fool-painterly-v2.png) | [420 px](../../../public/tarot/pilot/fool-painterly-420.webp), [600 px](../../../public/tarot/pilot/fool-painterly-600.webp) |
| The Tower | [Master](tower-painterly-v2.png) | [420 px](../../../public/tarot/pilot/tower-painterly-420.webp), [600 px](../../../public/tarot/pilot/tower-painterly-600.webp) |

### The Fool prompt

Use case: reference-guided style transfer for a SIGIL.FORGE Tarot card, full-bleed 2:3 portrait. Image 1 supplies the subject, pose and composition only. Image 2 is the approved deck painting and supplies the visual treatment only. Repaint all of Image 1 in the same dark figurative oil-painting language as Image 2: tactile and lightly weathered brushwork, storm-slate and charcoal shadow masses, thick draped cloth, warm ivory light raking across forms, localized tarnished mineral hues, and a small muted ember-red accent. Keep the subject clear and recognizable at a 120 px thumbnail, with depth from painted light and shadow. No graphic frame, lettering, numerals, neon, film artifacts, pasted paper, or woodcut hatching. THE FOOL / FORMA NIHIL. Preserve the open rising diagonal and the wide void. A young adult traveler in a wind-tossed heavy cloak, boots, and a muted rust scarf takes a forward step at the jagged tip of a rock ledge, with a little dog close behind. A bundle tied to a staff crosses behind the shoulders. Keep the large traveler in the lower-left-to-center portion, profile looking up and right, with one planted foot and one lifted just over the ledge. Keep the dog distinct at the lower left. A steep black wedge of weathered stone anchors the lower left. Keep the whole upper right as open storm-slate sky with broad indistinct clouds and the barest ivory vapor. No moon, sun, buildings, horizon motif or other point of interest in the void. Use warm side light at the face, raised knee, bark and ledge. A trace of ember red may catch on the exposed seam in the rock. Use the pose of the original Fool and the painterly materials and chiaroscuro of The World. Do not import any of The World's objects or figures.

### The Tower prompt

Use case: reference-guided style transfer for a SIGIL.FORGE Tarot card, full-bleed 2:3 portrait. Image 1 supplies the subject, pose and composition only. Image 2 is the approved deck painting and supplies the visual treatment only. Repaint all of Image 1 in the same dark figurative oil-painting language as Image 2: tactile and lightly weathered brushwork, storm-slate and charcoal shadow masses, thick draped cloth, warm ivory light raking across forms, localized tarnished mineral hues, and a small muted ember-red accent. Keep the subject clear and recognizable at a 120 px thumbnail, with depth from painted light and shadow. No graphic frame, lettering, numerals, neon, film artifacts, pasted paper, or woodcut hatching. THE TOWER / SYMBOLIC COLLAPSE. Preserve the fractured vertical: an immense narrow basalt and dark masonry tower fills the center from foreground to near the top. The crown-shaped stone cap is visibly thrown to the upper right. A single pale angled lightning strike reaches down from the dark cloud mass and meets the opening at its head. A narrow deep split runs down the masonry like the edge in a broken mirror, edged in ember red as though light catches on hot stone. Keep the two small draped human silhouettes falling clear on opposite sides, visually separate from the few flying blocks, with no wounds or visible injury. Keep rubble to a few readable shapes. Use wet near-black stone, storm-slate air, and ivory highlights that cut sharply across the masonry, in the same material and oil treatment as The World. Make the crown, split, tower silhouette and two tumbling figures independently readable. Do not import The World's serpent, dancer or star.

## Locked stick-only design

The [straight-line pilots](stick-study/contact-sheet.png) established the approved design. The [full deck contact sheet](stick-study/deck-contact-sheet.png) shows all 22 completed faces in ID order, left to right and top to bottom. The art uses straight-line marks. The approved Fool, Strength and Justice variants are supplied PNG masters. The palette is pure black (`#000000`), phosphor green (`#00FF41`) for the main subject, and egg white (`#F8F4E7`) for supporting marks.

| Card | Master | App copies |
| --- | --- | --- |
| The Fool | [Approved PNG](stick-study/fool_2.png) | [420 px](../../../public/tarot/pilot/fool-variant-sticks-420.webp), [600 px](../../../public/tarot/pilot/fool-variant-sticks-600.webp) |
| Strength | [Approved PNG](stick-study/strength-variant.png) | [420 px](../../../public/tarot/pilot/strength-variant-sticks-420.webp), [600 px](../../../public/tarot/pilot/strength-variant-sticks-600.webp) |
| Justice | [Approved PNG](stick-study/the_justice.png) | [420 px](../../../public/tarot/pilot/justice-variant-sticks-420.webp), [600 px](../../../public/tarot/pilot/justice-variant-sticks-600.webp) |
| The Tower | [Master](stick-study/tower.svg) | [420 px](../../../public/tarot/pilot/tower-sticks-420.webp), [600 px](../../../public/tarot/pilot/tower-sticks-600.webp) |
| The World | [Master](stick-study/world.svg) | [420 px](../../../public/tarot/pilot/world-sticks-420.webp), [600 px](../../../public/tarot/pilot/world-sticks-600.webp) |

The SVG masters and earlier studies are in [the same source folder](stick-study). The app uses two lossless WebP sizes per card, keyed by the stable ID and slug in [the card registry](../../../src/tarot/cards.js). The approved PNGs were supplied by the user.
