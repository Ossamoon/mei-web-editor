# Score Interaction Model

This document describes how the score preview (`ScorePreview.tsx`) handles hover and click interactions on Verovio-rendered SVG elements.

## INTERACTIVE_CLASSES

All hoverable/clickable elements are listed in `INTERACTIVE_CLASSES`. Each entry corresponds to a CSS class that Verovio assigns to SVG `<g>` elements.

| Category | Classes |
|----------|---------|
| Notes & rests | `note`, `chord`, `rest`, `mRest`, `beatRpt`, `halfmRpt`, `mRpt` |
| Structure | `measure` |
| Ornaments | `trill`, `mordent`, `turn`, `ornam` |
| Articulation & expression | `fermata`, `arpeg`, `breath`, `caesura` |
| Lines & curves | `slur`, `tie`, `phrase`, `gliss`, `hairpin`, `lv` |
| Dynamics & text | `dynam`, `tempo`, `dir` |
| Pedal & octave | `pedal`, `octave` |
| Rehearsal & repeats | `reh`, `repeatMark` |
| Harmony & fingering | `harm`, `fing` |
| Tremolo | `bTrem`, `fTrem` |

## Verovio SVG output structure

Verovio renders MEI elements as SVG `<g>` groups. The internal structure varies by element type, which directly affects how CSS highlights must be applied.

### Fill-based elements (majority)

Most elements use `<use>` glyph references whose color is controlled by `fill`. Notes, dynamics text, fermata symbols, etc. all fall into this category.

```xml
<g id="n1" class="note">
  <g class="notehead">
    <use xlink:href="#E0A4-..." />     <!-- glyph, colored by fill -->
  </g>
  <g class="stem">
    <path d="..." stroke-width="18" />  <!-- stem line -->
  </g>
</g>
```

### Stroke-based elements

Some elements are drawn with strokes only. Their SVG children have `fill="none"` inline, but CSS `fill !important` can override this and cause unwanted interior fill.

**Hairpin** (crescendo/decrescendo wedge):
```xml
<g id="hp1" class="hairpin">
  <polyline fill="none" points="..." />
</g>
```

### Mixed elements (fill + stroke)

**Octave** (8va/8vb) uses a `<use>` glyph (fill) for the text label, a `<path>` for the dashed line (stroke), and a `<polyline>` for the hook (stroke):
```xml
<g id="oct1" class="octave">
  <use xlink:href="#E510-..." />                    <!-- "8va" glyph (fill) -->
  <path d="..." stroke-dasharray="36 72" />         <!-- dashed line (stroke) -->
  <polyline fill="none" points="..." />             <!-- hook (stroke) -->
</g>
```

## CSS highlight strategy

Highlights are applied via CSS classes added by JavaScript event handlers. The design uses a 2-layer approach to handle the different SVG structures:

### Layer 1: Default (fill-based)

Applies to most elements. `score-hover` / `score-active` classes trigger `fill` color change and `drop-shadow` filter.

```css
.score-hover:not(.measure) * { fill: blue !important; }
```

### Layer 2: Stroke-only override

For `hairpin` and `octave`, the fill must remain `none` and the stroke is colored instead. These rules appear **after** the default rules in source order to win by cascade (same specificity 0-2-0).

```css
.score-hover.hairpin * { fill: none !important; stroke: blue !important; }
```

For `octave`, only the direct child `<path>` and `<polyline>` are overridden (the `<use>` glyph correctly uses the default fill rule):

```css
.score-hover.octave > path,
.score-hover.octave > polyline { fill: none !important; stroke: blue !important; }
```

### Specificity summary

| Selector | Specificity | Purpose |
|----------|-------------|---------|
| `.score-hover:not(.measure) *` | 0-2-0 | Default fill highlight |
| `.score-hover.hairpin *` | 0-2-0 | Stroke override (wins by source order) |
| `.score-hover.octave > polyline` | 0-2-1 | Octave stroke elements only |

**Key rule**: never add `:not()` pseudo-classes to the default rule to exclude specific elements. Each `:not()` increases specificity by one class level, causing the default rule to outrank the override rules.

## Unified color scheme

Both hover and active highlights use the same blue hue (Tailwind blue-500: `rgb(59, 130, 246)`), differentiated only by opacity:

| Usage | Hover (lighter) | Active (darker) |
|-------|-----------------|-----------------|
| `drop-shadow` | `0.4` | `0.7` |
| `fill` (non-measure) | `0.5` | `0.85` |
| `stroke` (hairpin etc.) | `0.5` | `0.85` |
| Measure overlay rect | `0.06` | `0.12` |

## React.memo and DOM preservation

`ScorePreview` is wrapped in `React.memo`. This is critical because highlights (`score-active`, `score-hover`, overlay rects) are applied by directly manipulating the SVG DOM via `classList` and `insertBefore`. If the component re-renders, `dangerouslySetInnerHTML` reconstructs the entire SVG DOM, destroying these manual modifications. When `highlightedId` has not changed (e.g. cursor moves within the same measure), the `useEffect` does not re-fire, so the highlight is lost permanently.

`React.memo` ensures re-renders only happen when props actually change (`svgContent`, `hasError`, `highlightedId`, `onNoteClick`).

## Adding a new interactive element

1. **Add the class name** to `INTERACTIVE_CLASSES` in `ScorePreview.tsx`
2. **Add the class name** to the CSS `pointer-events: bounding-box` selector list
3. **Determine the highlight type** by inspecting the Verovio SVG output:
   - Render an MEI file containing the element: `node -e "..."` (see test scripts) or use browser DevTools
   - Check whether children use `fill` (glyphs) or `stroke` (lines/curves)
4. **Apply the appropriate CSS layer**:
   - Fill-based: no additional CSS needed (default rules apply)
   - Stroke-based: add `fill: none` + `stroke: color` override after the default rules
5. **Add an example MEI file** in `src/assets/` that includes the element, and register it in `examples.ts`
6. **Add an E2E test** in `e2e/editor.spec.ts` to verify the highlight does not fill interiors or affect unrelated child elements
7. **Run verification**: `pnpm test --run && pnpm build && pnpm test:e2e`

## E2E test coverage

The `Stroke-based element highlights` test suite in `e2e/editor.spec.ts` verifies:

- `hairpin` hover: `fill` is `none` on child polyline
- `octave` hover: `fill` is `none` on child polyline

The `Cursor to score active highlight` test suite verifies:

- Cursor on note line → `score-active` class applied
- Cursor on closing tag → parent measure gets `score-active` (not sibling note)
- Cursor moves → `score-active` follows to new element
- Hover and active both use the same blue hue
- **Highlight persists on every line within a measure** (regression test for `React.memo` / DOM reconstruction issue)

These tests use `getComputedStyle` and DOM class inspection in a real browser to catch CSS specificity regressions and DOM lifecycle issues that jsdom-based unit tests cannot detect.
