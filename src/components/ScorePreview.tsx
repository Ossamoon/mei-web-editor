import { useEffect, useRef, useCallback } from "react";

interface ScorePreviewProps {
  svgContent: string | null;
  hasError: boolean;
  highlightedId: string | null;
  onNoteClick: (xmlId: string) => void;
}

function findNoteElement(el: Element | null, container: Element | null): Element | null {
  while (el && el !== container) {
    if (el.id && !el.id.startsWith("page") && !el.id.startsWith("def")) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

export function ScorePreview({
  svgContent,
  hasError,
  highlightedId,
  onNoteClick,
}: ScorePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef<Element | null>(null);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      const el = findNoteElement(e.target as Element, containerRef.current);
      if (el) onNoteClick(el.id);
    },
    [onNoteClick],
  );

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const el = findNoteElement(e.target as Element, container);

    if (hoveredRef.current && hoveredRef.current !== el) {
      hoveredRef.current.classList.remove("score-hover");
    }

    if (el) {
      el.classList.add("score-hover");
      hoveredRef.current = el;
    }
  }, []);

  const handleMouseOut = useCallback((e: MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const related = e.relatedTarget as Element | null;
    if (!related || !container.contains(related)) {
      if (hoveredRef.current) {
        hoveredRef.current.classList.remove("score-hover");
        hoveredRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("click", handleClick);
    container.addEventListener("mouseover", handleMouseOver);
    container.addEventListener("mouseout", handleMouseOut);
    return () => {
      container.removeEventListener("click", handleClick);
      container.removeEventListener("mouseover", handleMouseOver);
      container.removeEventListener("mouseout", handleMouseOut);
    };
  }, [handleClick, handleMouseOver, handleMouseOut]);

  // Editor cursor → score highlight
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Remove previous active highlight
    const prev = container.querySelector(".score-active");
    prev?.classList.remove("score-active");

    if (highlightedId) {
      const el = container.querySelector(`#${CSS.escape(highlightedId)}`);
      el?.classList.add("score-active");
    }
  }, [highlightedId, svgContent]);

  return (
    <div className="relative h-full w-full overflow-auto bg-white">
      <style>{`
        .score-hover { filter: drop-shadow(0 0 3px rgba(59, 130, 246, 0.6)); }
        .score-hover * { fill: rgba(59, 130, 246, 0.7) !important; }
        .score-active { filter: drop-shadow(0 0 4px rgba(234, 88, 12, 0.6)); }
        .score-active * { fill: rgba(234, 88, 12, 0.7) !important; }
      `}</style>
      <div
        ref={containerRef}
        className="p-4 cursor-pointer [&_svg]:w-full"
        dangerouslySetInnerHTML={{ __html: svgContent ?? "" }}
      />
      {hasError && (
        <div className="absolute inset-0 bg-red-500/15 pointer-events-none" />
      )}
    </div>
  );
}
