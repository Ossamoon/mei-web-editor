# MEI Web Editor

A browser-based editor for [MEI (Music Encoding Initiative)](https://music-encoding.org/) files with real-time score preview powered by [Verovio](https://www.verovio.org/).

## Features

- **Split-pane layout** -- XML editor on the left, rendered score on the right, with a draggable divider
- **Syntax highlighting** -- CodeMirror 6 with XML mode, bracket matching, code folding, and search/replace (Ctrl+F / Ctrl+H)
- **Real-time preview** -- Edits are validated and rendered as you type (300ms debounce)
- **Inline error diagnostics** -- XML parsing errors shown as squiggly underlines with hover tooltips (powered by saxes)
- **Error overlay** -- Invalid XML keeps the last valid score visible with a red semi-transparent overlay
- **Bidirectional linking**
  - Click a note in the score to jump to the corresponding `xml:id` in the editor
  - Editor cursor position highlights the corresponding element in the score
  - Hover over score elements to see a blue highlight
- **File I/O** -- Open `.mei`/`.xml` files via button or drag & drop; download with button or Ctrl+S / Cmd+S
- **Example files** -- Built-in examples (scales, chords, piano, ornaments, lyrics) selectable from a dropdown
- **Cursor position** -- Line and column displayed in the status bar

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- [pnpm](https://pnpm.io/)

### Setup

```bash
pnpm install
pnpm dev
```

Open http://localhost:5173/mei-web-editor/ in your browser.

### Build

```bash
pnpm build
```

The production build is output to `dist/`.

## Deployment

This project is configured for GitHub Pages via GitHub Actions. Push to the `main` branch to trigger automatic deployment.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | React 19 + Vite |
| Language | TypeScript |
| Editor | CodeMirror 6 |
| Score Rendering | Verovio (WASM) |
| XML Validation | saxes (SAX parser) |
| Styling | Tailwind CSS |
| Split Pane | allotment |

## License

MIT
