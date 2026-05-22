# Element Interaction Spec

Defines how each MEI element behaves in the score preview: rendering, selection highlight, and hover highlight. This spec guides the incremental expansion of interaction support in `ScorePreview.tsx`.

- CSS implementation details (specificity, React.memo constraints) → [score-interaction.md](score-interaction.md)
- Attribute classes per element → [mei-supported-elements.md](mei-supported-elements.md)

---

## Definitions

### Rendering Type

| Type | Description |
|------|-------------|
| `self` | The element produces its own SVG `<g>` and is visually rendered. Includes elements like `<beam>` and `<chord>` whose children are also individually rendered (in MEI, even `<note>` can contain `<accid>`, `<verse>/<syl>`, etc., so the self/container boundary is not strict) |
| `children` | Container element. Its children are rendered but the element itself has no distinct visual |
| `none` | Metadata, layout hints, etc. Not rendered |

### CSS Strategy

| Strategy | Description | Extra CSS needed |
|----------|-------------|------------------|
| `fill` | Highlight via fill property. Applies to the majority of elements | No (default rules apply) |
| `stroke` | `fill: none` + highlight via stroke property. For elements drawn with strokes only | Yes (`.score-hover.CLASS *` stroke override) |
| `mixed` | Glyphs use fill, lines/hooks use stroke | Yes (child combinator for `> path`, `> polyline`) |
| `overlay` | Insert a semi-transparent rect into the SVG. Only for measure | No (generated dynamically via JS) |
| `none` | No interaction | — |

### Interaction Behavior

**Prerequisite: `xml:id`** — Only elements that have an explicit `xml:id` attribute in the MEI source are interactive. Elements rendered from shorthand attributes (e.g., `clef.shape` on `<staffDef>`, `dots`/`accid` on `<note>`) produce SVG elements with Verovio auto-generated IDs but receive no hover or click response. See `docs/score-interaction.md` for implementation details.

**Selected** — The editor cursor is on a line belonging to this element. Score clicks also result in selection via "click → cursor move → selected".

- `self` elements → apply `score-active` class, render per CSS strategy
- `children` elements → highlight all renderable child elements within the container
- `none` elements → no action

**Hover** — The mouse cursor is over this element in the score. Non-rendered elements are not hover targets.

- `self` elements → apply `score-hover` class, render per CSS strategy
- `children` / `none` elements → not hoverable

### Color Scheme

Based on Tailwind blue-500 (`rgb(59, 130, 246)`), differentiated by opacity.

| Target | Hover | Selected |
|--------|-------|----------|
| drop-shadow | `rgba(59, 130, 246, 0.4)` 3px | `rgba(59, 130, 246, 0.7)` 4px |
| fill | `rgba(59, 130, 246, 0.5)` | `rgba(59, 130, 246, 0.85)` |
| stroke | `rgba(59, 130, 246, 0.5)` | `rgba(59, 130, 246, 0.85)` |
| overlay rect | `rgba(59, 130, 246, 0.06)` | `rgba(59, 130, 246, 0.12)` |

---

## Implemented Elements (34)

Currently registered in `INTERACTIVE_CLASSES` with both hover and selected working.

### Notes & Rests

| Element | Rendering | CSS Strategy | Notes |
|---------|-----------|-------------|-------|
| `<note>` | self | fill | Glyph (`<use>`) + stem (`<path>`). Default fill rule colors the entire group |
| `<chord>` | self | fill | Group containing multiple noteheads |
| `<rest>` | self | fill | Rest glyph |
| `<mRest>` | self | fill | Whole-measure rest |
| `<beatRpt>` | self | fill | Beat repeat sign |
| `<halfmRpt>` | self | fill | Half-measure repeat sign |
| `<mRpt>` | self | fill | Measure repeat sign |

### Structure

| Element | Rendering | CSS Strategy | Notes |
|---------|-----------|-------------|-------|
| `<measure>` | self | overlay | Semi-transparent rect over the staff area. Uses overlay instead of fill to avoid obscuring notes |
| `<clef>` | self | fill | Clef glyph (`<use>`). Only explicit `<clef>` elements with `xml:id` are interactive; clefs from `staffDef` shorthand attributes are not |

### Ornaments

| Element | Rendering | CSS Strategy | Notes |
|---------|-----------|-------------|-------|
| `<trill>` | self | fill | Trill glyph. May need mixed strategy if extender line is present |
| `<mordent>` | self | fill | Mordent glyph |
| `<turn>` | self | fill | Turn glyph |
| `<ornam>` | self | fill | Generic ornament glyph |

### Articulation & Expression

| Element | Rendering | CSS Strategy | Notes |
|---------|-----------|-------------|-------|
| `<fermata>` | self | fill | Fermata glyph |
| `<arpeg>` | self | fill | Arpeggio wavy line (glyph-based) |
| `<breath>` | self | fill | Breath mark glyph |
| `<caesura>` | self | fill | Caesura glyph |

### Lines & Curves

| Element | Rendering | CSS Strategy | Notes |
|---------|-----------|-------------|-------|
| `<slur>` | self | fill | Verovio renders as filled `<path>`, so fill rules work. Would need stroke strategy if rendering changes to stroked paths |
| `<tie>` | self | fill | Filled path, same as slur |
| `<phrase>` | self | fill | Filled path, same as slur |
| `<gliss>` | self | fill | Currently works with fill, but SVG output should be verified. May need stroke strategy |
| `<hairpin>` | self | stroke | Rendered as `<polyline fill="none">`. Stroke override required |
| `<lv>` | self | fill | Laissez vibrer. Filled path |

**hairpin CSS rules** (existing):
```css
.score-hover.hairpin * { fill: none !important; stroke: rgba(59, 130, 246, 0.5) !important; }
.score-active.hairpin * { fill: none !important; stroke: rgba(59, 130, 246, 0.85) !important; }
```

### Dynamics & Text

| Element | Rendering | CSS Strategy | Notes |
|---------|-----------|-------------|-------|
| `<dynam>` | self | fill | Dynamic marking text/glyph |
| `<tempo>` | self | fill | Tempo indication text |
| `<dir>` | self | fill | Performance direction text |

### Pedal & Octave

| Element | Rendering | CSS Strategy | Notes |
|---------|-----------|-------------|-------|
| `<pedal>` | self | mixed | Glyph (`<use>` → fill) + bracket-style line/hook (`<path>`/`<polyline>` → stroke). Currently works with default fill rules only, but bracket style may require mixed strategy |
| `<octave>` | self | mixed | `<use>` glyph (fill) + `<path>` dashed line (stroke) + `<polyline>` hook (stroke) |

**octave CSS rules** (existing):
```css
.score-hover.octave > path,
.score-hover.octave > polyline { fill: none !important; stroke: rgba(59, 130, 246, 0.5) !important; }
.score-active.octave > path,
.score-active.octave > polyline { fill: none !important; stroke: rgba(59, 130, 246, 0.85) !important; }
```

### Rehearsal & Repeats

| Element | Rendering | CSS Strategy | Notes |
|---------|-----------|-------------|-------|
| `<reh>` | self | fill | Rehearsal mark (text + enclosure) |
| `<repeatMark>` | self | fill | Segno/coda glyph |

### Harmony & Fingering

| Element | Rendering | CSS Strategy | Notes |
|---------|-----------|-------------|-------|
| `<harm>` | self | fill | Harmony label text |
| `<fing>` | self | fill | Fingering number text |

### Tremolo

| Element | Rendering | CSS Strategy | Notes |
|---------|-----------|-------------|-------|
| `<bTrem>` | self | fill | Single-note tremolo (note + tremolo slashes) |
| `<fTrem>` | self | fill | Two-note tremolo (2 notes + tremolo slashes) |

---

## Priority Candidates (not yet implemented)

High-frequency elements that produce SVG output via Verovio and should be prioritized for interaction support.

### Musical Content

| Element | Rendering | CSS Strategy | Selected | Hover | Notes |
|---------|-----------|-------------|----------|-------|-------|
| `<keySig>` | self | fill | score-active | score-hover | Key signature (multiple accidental glyphs) |
| `<meterSig>` | self | fill | score-active | score-hover | Time signature glyph |
| `<accid>` | self | fill | score-active | score-hover | Accidental glyph |
| `<artic>` | self | fill | score-active | score-hover | Articulation mark glyph |
| `<barLine>` | self | stroke | score-active | score-hover | Vertical line path. Requires stroke strategy |
| `<multiRest>` | self | fill | score-active | score-hover | Multi-measure rest (glyph + number) |
| `<dot>` | self | fill | score-active | score-hover | Augmentation dot (small glyph) |
| `<syl>` | self | fill | score-active | score-hover | Lyric syllable text |

**barLine CSS rules** (to be added):
```css
.score-hover.barLine * { fill: none !important; stroke: rgba(59, 130, 246, 0.5) !important; }
.score-active.barLine * { fill: none !important; stroke: rgba(59, 130, 246, 0.85) !important; }
```

### Control Events

| Element | Rendering | CSS Strategy | Selected | Hover | Notes |
|---------|-----------|-------------|----------|-------|-------|
| `<bracketSpan>` | self | stroke | score-active | score-hover | Bracket line |
| `<mNum>` | self | fill | score-active | score-hover | Measure number text |
| `<cpMark>` | self | fill | score-active | score-hover | Copy mark text |

**bracketSpan CSS rules** (to be added):
```css
.score-hover.bracketSpan * { fill: none !important; stroke: rgba(59, 130, 246, 0.5) !important; }
.score-active.bracketSpan * { fill: none !important; stroke: rgba(59, 130, 246, 0.85) !important; }
```

### Text & Annotations

| Element | Rendering | CSS Strategy | Selected | Hover | Notes |
|---------|-----------|-------------|----------|-------|-------|
| `<anchoredText>` | self | fill | score-active | score-hover | Positioned text |

### Figured Bass

| Element | Rendering | CSS Strategy | Selected | Hover | Notes |
|---------|-----------|-------------|----------|-------|-------|
| `<f>` | self | fill | score-active | score-hover | Individual figured bass number |

---

## Remaining Elements (by category)

Rendering Type only. CSS Strategy / Selected / Hover definitions will be added when each element is implemented.

### Score Structure

| Element | Rendering | Notes |
|---------|-----------|-------|
| `<mdiv>` | children | Top-level container |
| `<score>` | children | Score container |
| `<scoreDef>` | none | Rendering parameters. Children (clef, keySig, etc.) are rendered |
| `<section>` | children | Structural container |
| `<ending>` | self | Volta bracket + number. Future candidate |
| `<expansion>` | none | Playback order only |
| `<staffGrp>` | self | Brace/bracket. Low priority for interaction |
| `<staffDef>` | none | Configuration only. Children are rendered |
| `<layerDef>` | none | Configuration only |
| `<grpSym>` | self | Brace/bracket glyph. Future candidate |
| `<label>` | self | Staff label text |
| `<labelAbbr>` | self | Abbreviated staff label |
| `<pgHead>` | self | Page header text |
| `<pgFoot>` | self | Page footer text |
| `<ossia>` | children | Ossia passage container |
| `<oStaff>` | children | Ossia staff container |

### Musical Content (remaining)

| Element | Rendering | Notes |
|---------|-----------|-------|
| `<staff>` | children | Staff container. Staff lines are drawn but not individually selectable |
| `<layer>` | children | Layer container |
| `<mRpt2>` | self | Two-measure repeat. Similar to mRpt |
| `<multiRpt>` | self | Multi-measure repeat |
| `<mSpace>` | none | Invisible spacer |
| `<beam>` | self | Renders beam lines. Child notes are individually interactive |
| `<beamSpan>` | self | Control-event version of beam. Future candidate |
| `<tuplet>` | self | Renders bracket/number. Child notes are individually interactive |
| `<graceGrp>` | children | Grace note container |
| `<space>` | none | Invisible duration spacer |
| `<meterSigGrp>` | children | Alternating meter container |
| `<keyAccid>` | self | Individual accidental within keySig |
| `<verse>` | children | Lyric verse container |
| `<syllable>` | children | Neume notation container |
| `<neume>` | self | Neume glyph |
| `<nc>` | self | Neume component |
| `<plica>` | self | Mensural notation |
| `<liquescent>` | self | Neume notation |
| `<divLine>` | self | Chant division line |
| `<custos>` | self | Guide tone |
| `<mensur>` | self | Mensuration sign |
| `<proport>` | self | Proportion sign |
| `<ligature>` | self | Mensural notation. Renders ligature. Children also rendered individually |
| `<tabGrp>` | self | Tablature group |
| `<tabDurSym>` | self | Tablature duration symbol |
| `<oriscus>` | self | Neume notation |
| `<quilisma>` | self | Neume notation |

### Control Events (remaining)

*All 26 control event elements are either implemented or listed as priority candidates above.*

### Figured Bass

| Element | Rendering | Notes |
|---------|-----------|-------|
| `<fb>` | children | Figured bass container |

### Text & Annotations (remaining)

| Element | Rendering | Notes |
|---------|-----------|-------|
| `<annot>` | none | Annotation. Typically not rendered visually |
| `<fig>` | self | Figure container for graphics |
| `<rend>` | self | Inline text rendering (font/style) |
| `<svg>` | self | Embedded SVG pass-through |
| `<symbol>` | self | Symbol glyph reference |
| `<symbolDef>` | none | Symbol definition (not rendered inline) |
| `<symbolTable>` | none | Symbol definition container |
| `<num>` | self | Numeric text |
| `<lb>` | none | Line break hint |
| `<div>` | children | Text division container |
| `<graphic>` | self | External image reference |

### Editorial (all 18)

All `children`. Transparent wrappers; child elements render normally.

| Element | Rendering |
|---------|-----------|
| `<abbr>` | children |
| `<add>` | children |
| `<app>` | children |
| `<choice>` | children |
| `<corr>` | children |
| `<damage>` | children |
| `<del>` | children |
| `<expan>` | children |
| `<lem>` | children |
| `<orig>` | children |
| `<rdg>` | children |
| `<ref>` | children |
| `<reg>` | children |
| `<restore>` | children |
| `<sic>` | children |
| `<subst>` | children |
| `<supplied>` | children |
| `<unclear>` | children |

### Layout & Facsimile (all 5)

All `none`. No visual rendering.

| Element | Rendering |
|---------|-----------|
| `<pb>` | none |
| `<sb>` | none |
| `<facsimile>` | none |
| `<surface>` | none |
| `<zone>` | none |

### Metadata (all 3)

All `none`.

| Element | Rendering |
|---------|-----------|
| `<instrDef>` | none |
| `<tuning>` | none |
| `<course>` | none |

---

## Implementation Status Summary

### By Rendering Type

| Rendering | Count |
|-----------|-------|
| self | 79 |
| children | 31 |
| none | 18 |
| **Total** | **128** |

### By Interaction Status

| Status | Count |
|--------|-------|
| Implemented (INTERACTIVE_CLASSES) | 34 |
| Priority candidates (detailed in this doc) | 13 |
| Future candidates (self-rendering, not yet defined) | 32 |
| No interaction needed (children/none) | 49 |
| **Total** | **128** |

### By CSS Strategy (self-rendering elements)

| Strategy | Implemented | Priority | Future |
|----------|------------|----------|--------|
| fill | 30 | 11 | 32 |
| stroke | 1 (hairpin) | 2 (barLine, bracketSpan) | 0 |
| mixed | 2 (octave, pedal) | 0 | 0 |
| overlay | 1 (measure) | 0 | 0 |
