import { useEffect, useRef, useCallback } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import {
  syntaxHighlighting,
  defaultHighlightStyle,
  foldGutter,
  bracketMatching,
} from "@codemirror/language";
import { xml } from "@codemirror/lang-xml";
import { linter, type Diagnostic } from "@codemirror/lint";
import { search, searchKeymap } from "@codemirror/search";
import type { XmlError } from "../utils/validate";

interface MeiEditorProps {
  value: string;
  onChange: (value: string) => void;
  errors: XmlError[];
  onCursorChange?: (line: number, col: number) => void;
}

export function MeiEditor({ value, onChange, errors, onCursorChange }: MeiEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const errorsRef = useRef(errors);
  const onCursorChangeRef = useRef(onCursorChange);
  useEffect(() => {
    onChangeRef.current = onChange;
    errorsRef.current = errors;
    onCursorChangeRef.current = onCursorChange;
  }, [onChange, errors, onCursorChange]);

  const isProgrammaticRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const xmlLinter = linter((view) => {
      const diagnostics: Diagnostic[] = [];
      const doc = view.state.doc;

      for (const err of errorsRef.current) {
        const lineNum = Math.min(err.line, doc.lines);
        const line = doc.line(lineNum);
        const from = Math.min(line.from + err.column, line.to);
        const to = line.to;

        diagnostics.push({
          from,
          to: Math.max(to, from + 1),
          severity: "error",
          message: err.message,
        });
      }

      return diagnostics;
    });

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        foldGutter(),
        bracketMatching(),
        history(),
        syntaxHighlighting(defaultHighlightStyle),
        xml(),
        search(),
        keymap.of([...defaultKeymap, ...historyKeymap, ...searchKeymap]),
        xmlLinter,
        EditorView.updateListener.of((update) => {
          if (update.docChanged && !isProgrammaticRef.current) {
            onChangeRef.current(update.state.doc.toString());
          }
          if (update.selectionSet || update.docChanged) {
            const pos = update.state.selection.main.head;
            const line = update.state.doc.lineAt(pos);
            onCursorChangeRef.current?.(line.number, pos - line.from);
          }
        }),
        EditorView.theme({
          "&": { height: "100%" },
          ".cm-scroller": { overflow: "auto" },
          ".cm-activeLine": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    // Expose for E2E testing
    if (import.meta.env.DEV) {
      (window as unknown as Record<string, unknown>).__editorView = view;
    }

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value changes
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    const currentDoc = view.state.doc.toString();
    if (currentDoc !== value) {
      isProgrammaticRef.current = true;
      view.dispatch({
        changes: {
          from: 0,
          to: currentDoc.length,
          insert: value,
        },
      });
      isProgrammaticRef.current = false;
    }
  }, [value]);

  // Force lint refresh when errors change
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    // Trigger a re-lint by dispatching a no-op transaction
    view.dispatch({});
  }, [errors]);

  const scrollToPosition = useCallback((pos: number) => {
    const view = viewRef.current;
    if (!view) return;

    view.dispatch({
      selection: { anchor: pos },
      effects: EditorView.scrollIntoView(pos, { y: "center" }),
    });
    view.focus();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      (el as unknown as { scrollToPosition: typeof scrollToPosition }).scrollToPosition =
        scrollToPosition;
    }
  }, [scrollToPosition]);

  return <div ref={containerRef} className="h-full w-full overflow-hidden" />;
}
