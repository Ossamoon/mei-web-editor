# CLAUDE.md

## Project Overview

MEI Web Editor — a browser-based editor for MEI (Music Encoding Initiative) XML files with real-time score preview via Verovio WASM. Deployed as a static SPA on GitHub Pages.

## Tech Stack

- **Framework**: React 19 + Vite + TypeScript
- **Editor**: CodeMirror 6 (`@codemirror/lang-xml`, `@codemirror/lint`, `@codemirror/search`)
- **Score Rendering**: Verovio (WASM, npm package `verovio`)
- **XML Validation**: `saxes` (SAX parser with line/column info)
- **Styling**: Tailwind CSS v4 (light mode only)
- **Split Pane**: `allotment`
- **Package Manager**: pnpm
- **Deploy**: GitHub Pages via GitHub Actions

## Commands

```bash
pnpm dev           # Start dev server (http://localhost:5173/mei-web-editor/)
pnpm build         # Type check + production build
pnpm test          # Run Vitest unit/component tests
pnpm test:e2e      # Run Playwright E2E tests (requires chromium)
pnpm test:coverage # Vitest with coverage report
pnpm lint          # ESLint
```

## Architecture

```
src/
├── App.tsx              # Main orchestration (state, render pipeline)
├── examples.ts          # Example MEI file registry
├── components/
│   ├── MeiEditor.tsx    # CodeMirror 6 wrapper (XML highlighting, lint, search)
│   ├── ScorePreview.tsx # Verovio SVG display + hover/active highlights
│   ├── Toolbar.tsx      # File I/O buttons + Examples dropdown
│   └── StatusBar.tsx    # Validation status + cursor position
├── hooks/
│   ├── useVerovio.ts    # Verovio WASM init + MEI→SVG rendering
│   ├── useKeyboardShortcut.ts  # Ctrl/Cmd+key handler
│   └── useDragAndDrop.ts       # Window-level file drop handler
├── utils/
│   ├── validate.ts      # saxes-based XML well-formedness check (line/col errors)
│   └── findXmlId.ts     # Find xml:id at cursor position (walks up parent elements)
├── assets/              # Sample .mei files (5 examples)
└── test/
    └── setup.ts         # Vitest global mocks (ResizeObserver, Verovio, URL API)
e2e/
└── editor.spec.ts       # Playwright E2E tests
```

## Key Patterns

- **Debounced rendering**: Editor changes trigger validation + Verovio render after 300ms
- **Error handling**: Invalid XML keeps last valid score visible with red overlay; saxes errors shown as CodeMirror lint diagnostics (squiggly lines + hover tooltips)
- **Bidirectional sync**: Editor cursor → score highlight (orange); score click → editor jump; score hover → blue highlight
- **Verovio mock in tests**: `src/test/setup.ts` mocks `verovio/wasm` and `verovio/esm` globally for jsdom environment
- **E2E editor access**: In dev mode, `window.__editorView` exposes CodeMirror EditorView for Playwright tests
- **Test file exclusion**: `tsconfig.app.json` excludes `*.test.ts(x)` and `src/test/` from type-checking build

## Testing Strategy

**テストファーストで開発する。** 新機能の追加やバグ修正を行う際は、まず期待する挙動をテストとして記述し、テストが失敗することを確認してから実装に入る。

- **Unit tests** (`*.test.ts`): Pure logic (validate, findXmlId, examples)
- **Component tests** (`*.test.tsx`): React components with Testing Library (StatusBar, Toolbar, ScorePreview)
- **Hook tests**: Custom hooks with `renderHook` (useKeyboardShortcut, useDragAndDrop)
- **E2E** (`e2e/`): Full browser flow with Playwright (initial render, editing, error states, hover/highlight, file download, example selection)

### テストの運用ルール

- 機能追加時: 先にテストを書く → 失敗確認 → 実装 → パス確認
- バグ修正時: バグを再現するテストを書く → 修正 → パス確認
- リファクタリング時: 既存テストが全てパスすることを常に確認
- UIの挙動変更時: E2Eテストに反映し、セレクタやアサーションが最新のDOM構造と一致していることを確認
- `pnpm test --run && pnpm build` を実装の区切りごとに実行する

## Conventions

- Collocate test files next to source (`Component.test.tsx` beside `Component.tsx`)
- MEI sample files go in `src/assets/` with `?raw` imports
- No dark mode — light theme only
- GitHub Pages base path: `/mei-web-editor/` (configured in `vite.config.ts`)
- Verovio warnings about justification/compression are expected and harmless
