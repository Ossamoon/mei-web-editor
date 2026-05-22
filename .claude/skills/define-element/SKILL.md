---
name: define-element
description: Investigate and define interaction behavior for an MEI element
disable-model-invocation: true
argument-hint: <element-name>
arguments: [element]
allowed-tools: WebFetch(domain:music-encoding.org) WebFetch(domain:book.verovio.org) Bash Grep Glob Read Edit Write
---

# Define MEI Element Interaction: `<$element>`

Follow these steps to investigate and define the interaction spec for `<$element>`.

## Step 1: Check Official Reference

Fetch the MEI guidelines page for the element:

- https://music-encoding.org/guidelines/v5/elements/$element.html

Key points to check:
- Purpose and semantics
- Available attributes (especially `xml:id` and rendering-related)
- Allowed child elements
- Allowed parent elements
- Usage examples

## Step 2: Check Related References

Also check as needed:
- Verovio support: attribute classes in `docs/mei-supported-elements.md`
- Current spec: existing definition in `docs/element-interaction-spec.md`
- Similar elements: compare with already-defined elements in the same category

## Step 3: Draft Definition

Propose the following three points and present them to the user:

1. **Rendering Type**: `self` / `children` / `none`
2. **CSS Strategy**: `fill` / `stroke` / `mixed` / `overlay` / `none`
3. **Selected / Hover behavior**: specific behavior (how `score-active` / `score-hover` classes are applied)

Include rationale for each choice.

## Step 4: Add Temporary Example

After user approval, do the following:

1. Create a minimal MEI file containing `<$element>` at `src/assets/example-temp-$element.mei`
   - **All `<measure>` elements must have `xml:id`** (e.g., `xml:id="m1"`)。`xml:id`がないとmeasureのホバー・クリックが動作しない（`validXmlIds`フィルタリングにより除外されるため）
   - 検証対象の要素にも必ず`xml:id`を付与する
2. Edit `src/examples.ts` to add the example **at the beginning of the array** (so it becomes the default display)

```typescript
// Prepend to examples array
{ name: "[TEMP] $element", fileName: "example-temp-$element.mei", content: tempMei },
```

3. If the dev server is not running, prompt the user to run `pnpm dev`

## Step 5: Implement Interaction

Based on the approved definition from Step 3, implement the interaction in the source code.

### Files to modify

| File | What to change |
|------|---------------|
| `src/components/ScorePreview.tsx` — `INTERACTIVE_CLASSES` (Set) | Add `"$element"` to the appropriate category comment block |
| `src/components/ScorePreview.tsx` — `<style>` tag (inline CSS) | **Only if CSS Strategy is `stroke` or `mixed`**: add element-specific CSS rules (see patterns below) |

### CSS rule patterns (only when needed)

**stroke strategy** (e.g. hairpin, barLine):
```css
.score-hover.$element * { fill: none !important; stroke: rgba(59, 130, 246, 0.5) !important; }
.score-active.$element * { fill: none !important; stroke: rgba(59, 130, 246, 0.85) !important; }
```

**mixed strategy** (e.g. octave — glyph children use fill, line/hook children use stroke):
```css
.score-hover.$element > path,
.score-hover.$element > polyline { fill: none !important; stroke: rgba(59, 130, 246, 0.5) !important; }
.score-active.$element > path,
.score-active.$element > polyline { fill: none !important; stroke: rgba(59, 130, 246, 0.85) !important; }
```

**fill strategy**: No extra CSS needed — default rules apply.

### No changes needed in these files (for reference)

- `src/components/ScorePreview.tsx` — `findNoteElement()`: Already walks up the DOM checking `INTERACTIVE_CLASSES`. Adding to the Set is sufficient.
- `src/components/ScorePreview.tsx` — hover/click handlers: Generic; work for any element in `INTERACTIVE_CLASSES`.
- `src/App.tsx` — `handleNoteClick` / `handleCursorChange`: Generic; driven by `xml:id`, no element-specific logic.

## Step 6: Browser Verification

Ask the user to verify in the browser:
- How the element is rendered in the score
- SVG structure via DevTools (`<g>` class names, fill/stroke attributes on children)
- Hover highlight behavior (color, coverage)
- Click → editor cursor jump behavior
- Editor cursor → score highlight behavior

Receive findings from the user.

## Step 7: Revise Definition (if needed)

Update the draft based on browser verification results. If code changes are needed, update `ScorePreview.tsx` accordingly.

## Step 8: Finalize and Update Docs

After user approval, update `docs/element-interaction-spec.md`:
- Update the element's row (Rendering Type, CSS Strategy, Notes)
- For stroke/mixed strategies, include specific CSS rules

## Step 9: Document Findings

If any noteworthy findings about rendering:
- Add to the element's Notes column in `docs/element-interaction-spec.md`
- If needed, add to the SVG structure section of `docs/score-interaction.md`

## Step 10: Clean Up Temporary Example

After the definition is finalized:

1. Delete `src/assets/example-temp-$element.mei`
2. Remove the temporary import and array entry from `src/examples.ts`
3. Confirm `examples[0]` is back to the original default
4. Run `pnpm test --run && pnpm build` to verify nothing is broken

---

## Context

**Note**: Only elements with explicit `xml:id` in the MEI source are interactive in the score preview. Elements rendered from shorthand attributes on `<staffDef>` (e.g., `clef.shape`) or `<note>` (e.g., `dots`, `accid`) have Verovio auto-generated SVG IDs but do not respond to hover or click. This is enforced by `validXmlIds` filtering in `ScorePreview.tsx` — see `docs/score-interaction.md` for details.

Current INTERACTIVE_CLASSES:
!`grep -A50 "INTERACTIVE_CLASSES = new Set" src/components/ScorePreview.tsx | head -35`

Existing definition for this element:
!`grep "$element" docs/element-interaction-spec.md`
