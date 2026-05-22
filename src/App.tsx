import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

import { Toolbar } from "./components/Toolbar";
import { MeiEditor } from "./components/MeiEditor";
import { ScorePreview } from "./components/ScorePreview";
import { StatusBar } from "./components/StatusBar";
import { useVerovio } from "./hooks/useVerovio";
import { useKeyboardShortcut } from "./hooks/useKeyboardShortcut";
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import { validateXml, type XmlError } from "./utils/validate";
import { findXmlIdAtCursor, getAllXmlIds } from "./utils/findXmlId";
import { findElementAtCursor, type CursorContext } from "./utils/findElement";
import { examples } from "./examples";

function App() {
  const [meiContent, setMeiContent] = useState(examples[0].content);
  const [fileName, setFileName] = useState(examples[0].fileName);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [errors, setErrors] = useState<XmlError[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [cursorLine, setCursorLine] = useState(1);
  const [cursorCol, setCursorCol] = useState(0);
  const [highlightedNoteId, setHighlightedNoteId] = useState<string | null>(null);
  const [cursorContext, setCursorContext] = useState<CursorContext | null>(null);
  const { isReady, renderMei } = useVerovio();

  const validXmlIds = useMemo(() => getAllXmlIds(meiContent), [meiContent]);

  const editorContainerRef = useRef<HTMLDivElement>(null);
  const scoreContainerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const latestContentRef = useRef(meiContent);
  useEffect(() => {
    latestContentRef.current = meiContent;
  }, [meiContent]);

  // Render MEI to SVG
  const doRender = useCallback(() => {
    if (!isReady) return;

    const content = latestContentRef.current;
    const result = validateXml(content);
    setErrors(result.errors);

    if (result.valid) {
      const scorePanel = scoreContainerRef.current;
      const width = scorePanel?.clientWidth ?? 800;
      const svg = renderMei(content, width);
      if (svg) {
        setSvgContent(svg);
      }
    }
  }, [isReady, renderMei]);

  // Initial render when Verovio is ready
  useEffect(() => {
    if (isReady) doRender();
  }, [isReady, doRender]);

  // Debounced render on content change
  const handleContentChange = useCallback(
    (newContent: string) => {
      latestContentRef.current = newContent;
      setMeiContent(newContent);
      setIsDirty(true);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(doRender, 300);
    },
    [doRender],
  );

  // File open handler (with unsaved changes confirmation)
  const handleFileOpen = useCallback(
    (content: string, name: string) => {
      if (isDirty && !window.confirm("You have unsaved changes. Discard and open a new file?")) {
        return;
      }
      setMeiContent(content);
      setFileName(name);
      setIsDirty(false);
      latestContentRef.current = content;
      setTimeout(doRender, 0);
    },
    [doRender, isDirty],
  );

  // Download handler
  const handleDownload = useCallback(() => {
    const blob = new Blob([meiContent], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    setIsDirty(false);
  }, [meiContent, fileName]);

  // Ctrl+S / Cmd+S to download
  useKeyboardShortcut("s", handleDownload);

  // Drag & Drop
  useDragAndDrop(handleFileOpen);

  // Re-render on resize of score panel
  useEffect(() => {
    const scorePanel = scoreContainerRef.current;
    if (!scorePanel) return;

    const observer = new ResizeObserver(() => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(doRender, 200);
    });
    observer.observe(scorePanel);
    return () => observer.disconnect();
  }, [doRender]);

  // Score note click → editor jump
  const handleNoteClick = useCallback(
    (xmlId: string) => {
      const pattern = `xml:id="${xmlId}"`;
      const idx = meiContent.indexOf(pattern);
      if (idx === -1) return;

      const editorEl = editorContainerRef.current?.querySelector("div");
      if (editorEl && "scrollToPosition" in editorEl) {
        (editorEl as unknown as { scrollToPosition: (pos: number) => void }).scrollToPosition(idx);
      }
    },
    [meiContent],
  );

  // Cursor position change → find xml:id at cursor → highlight in score
  const handleCursorChange = useCallback(
    (line: number, col: number) => {
      setCursorLine(line);
      setCursorCol(col);
      const content = latestContentRef.current;
      setHighlightedNoteId(findXmlIdAtCursor(content, line));
      setCursorContext(findElementAtCursor(content, line, col));
    },
    [],
  );

  // Memoize editor to prevent re-render on unrelated state changes
  const editor = useMemo(
    () => (
      <MeiEditor
        value={meiContent}
        onChange={handleContentChange}
        errors={errors}
        onCursorChange={handleCursorChange}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleContentChange, errors, handleCursorChange],
  );

  return (
    <div className="flex flex-col h-full">
      <Toolbar
        fileName={fileName}
        onFileOpen={handleFileOpen}
        onDownload={handleDownload}
      />
      <div className="flex-1 overflow-hidden">
        <Allotment defaultSizes={[50, 50]}>
          <Allotment.Pane minSize={200}>
            <div ref={editorContainerRef} className="h-full">
              {editor}
            </div>
          </Allotment.Pane>
          <Allotment.Pane minSize={200}>
            <div ref={scoreContainerRef} className="h-full">
              <ScorePreview
                svgContent={svgContent}
                hasError={errors.length > 0}
                highlightedId={highlightedNoteId}
                onNoteClick={handleNoteClick}
                validXmlIds={validXmlIds}
              />
            </div>
          </Allotment.Pane>
        </Allotment>
      </div>
      <StatusBar
        isValid={errors.length === 0}
        errorMessage={errors[0]?.message ?? null}
        verovioReady={isReady}
        cursorLine={cursorLine}
        cursorCol={cursorCol}
        cursorContext={cursorContext}
      />
    </div>
  );
}

export default App;
