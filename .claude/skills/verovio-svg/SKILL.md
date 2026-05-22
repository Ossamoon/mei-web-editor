---
name: verovio-svg
description: Verovio SVG output patterns reference. Use when discussing SVG structure, CSS highlight strategy, class names, or how Verovio renders MEI elements to SVG.
---

# Verovio SVG Output Patterns

Reference for how Verovio renders MEI elements as SVG. Use this when:
- Determining the CSS strategy (fill / stroke / mixed) for a new element
- Inspecting or debugging SVG highlight behavior
- Adding new elements to `INTERACTIVE_CLASSES` in `ScorePreview.tsx`

Read the detailed reference:

```
${CLAUDE_SKILL_DIR}/svg-patterns.md
```

Related docs:
- `docs/score-interaction.md` — CSS highlight implementation details
- `docs/element-interaction-spec.md` — per-element interaction definitions
- `src/components/ScorePreview.tsx` — runtime implementation
