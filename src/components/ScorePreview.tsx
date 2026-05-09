import { useEffect, useRef, useCallback } from "react";

interface ScorePreviewProps {
  svgContent: string | null;
  hasError: boolean;
  highlightedId: string | null;
  onNoteClick: (xmlId: string) => void;
}

// Verovio CSS classes that represent clickable/hoverable musical elements
const INTERACTIVE_CLASSES = new Set([
  "note", "chord", "rest", "mRest", "beatRpt", "halfmRpt", "mRpt",
  "measure",
]);

function findNoteElement(el: Element | null, container: Element | null): Element | null {
  while (el && el !== container) {
    if (el.id) {
      const classes = el.getAttribute("class")?.split(" ") ?? [];
      if (classes.some((c) => INTERACTIVE_CLASSES.has(c))) {
        return el;
      }
    }
    el = el.parentElement;
  }
  return null;
}

function isMeasure(el: Element): boolean {
  return el.getAttribute("class")?.split(" ").includes("measure") ?? false;
}

/**
 * Get the staff line area spanning all staves within a measure.
 * For piano (grand staff), this covers from the top of the treble staff
 * to the bottom of the bass staff.
 * Returns { x, y, width, height } based on staff line paths, not note content.
 */
function getStaffArea(measureEl: Element): { x: number; y: number; width: number; height: number } | null {
  if (!(measureEl instanceof SVGGraphicsElement)) return null;

  try {
    // Collect staff line y-coordinates from ALL staves in the measure
    const staffGroups = measureEl.querySelectorAll(":scope > .staff");
    if (staffGroups.length === 0) return null;

    const yValues: number[] = [];
    staffGroups.forEach((staffGroup) => {
      // Staff lines are horizontal <path> children (stroke-width="13", format: "M<x> <y> L<x2> <y>")
      const paths = staffGroup.querySelectorAll(":scope > path");
      paths.forEach((path) => {
        const d = path.getAttribute("d") ?? "";
        // Match horizontal lines only (M<x1> <y> L<x2> <y> where both y are same)
        const match = d.match(/^M([\d.]+) ([\d.]+) L([\d.]+) ([\d.]+)$/);
        if (match && match[2] === match[4]) {
          yValues.push(parseFloat(match[2]));
        }
      });
    });

    if (yValues.length === 0) return null;

    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

    // Use the measure's full x-range from getBBox
    const bbox = measureEl.getBBox();

    return { x: bbox.x, y: yMin, width: bbox.width, height: yMax - yMin };
  } catch {
    return null;
  }
}

/**
 * Add a semi-transparent overlay rect to a measure element,
 * limited to the staff line area (not expanding with stems/ledger lines).
 */
function addMeasureOverlay(el: Element, color: string, className: string): SVGRectElement | null {
  // Don't add if already present
  if (el.querySelector(`:scope > .${className}`)) return null;

  const area = getStaffArea(el);
  if (!area) return null;

  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", String(area.x));
  rect.setAttribute("y", String(area.y));
  rect.setAttribute("width", String(area.width));
  rect.setAttribute("height", String(area.height));
  rect.setAttribute("fill", color);
  rect.setAttribute("class", className);
  rect.style.pointerEvents = "none";
  el.insertBefore(rect, el.firstChild);
  return rect;
}

function removeMeasureOverlay(el: Element, className: string) {
  // Remove ALL matching overlays (in case multiple were added)
  el.querySelectorAll(`:scope > .${className}`).forEach((rect) => rect.remove());
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
      if (isMeasure(hoveredRef.current)) {
        removeMeasureOverlay(hoveredRef.current, "measure-hover-overlay");
      }
      hoveredRef.current = null;
    }

    if (el && el !== hoveredRef.current) {
      el.classList.add("score-hover");
      hoveredRef.current = el;
      if (isMeasure(el) && !el.classList.contains("score-active")) {
        addMeasureOverlay(el, "rgba(59, 130, 246, 0.08)", "measure-hover-overlay");
      }
    }
  }, []);

  const handleMouseOut = useCallback((e: MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const related = e.relatedTarget as Element | null;
    if (!related || !container.contains(related)) {
      if (hoveredRef.current) {
        hoveredRef.current.classList.remove("score-hover");
        if (isMeasure(hoveredRef.current)) {
          removeMeasureOverlay(hoveredRef.current, "measure-hover-overlay");
        }
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
    if (prev) {
      prev.classList.remove("score-active");
      if (isMeasure(prev)) {
        removeMeasureOverlay(prev, "measure-active-overlay");
      }
    }

    if (highlightedId) {
      const el = container.querySelector(`#${CSS.escape(highlightedId)}`);
      if (el) {
        el.classList.add("score-active");
        if (isMeasure(el)) {
          addMeasureOverlay(el, "rgba(234, 88, 12, 0.08)", "measure-active-overlay");
        }
      }
    }
  }, [highlightedId, svgContent]);

  return (
    <div className="relative h-full w-full overflow-auto bg-white">
      <style>{`
        .note, .chord, .rest, .mRest, .beatRpt, .halfmRpt, .mRpt, .measure {
          pointer-events: bounding-box;
          cursor: pointer;
        }
        .score-hover:not(.measure) { filter: drop-shadow(0 0 3px rgba(59, 130, 246, 0.6)); }
        .score-hover:not(.measure) * { fill: rgba(59, 130, 246, 0.7) !important; }
        .score-active:not(.measure) { filter: drop-shadow(0 0 4px rgba(234, 88, 12, 0.6)); }
        .score-active:not(.measure) * { fill: rgba(234, 88, 12, 0.7) !important; }
      `}</style>
      <div
        ref={containerRef}
        className="p-4 [&_svg]:w-full"
        dangerouslySetInnerHTML={{ __html: svgContent ?? "" }}
      />
      {hasError && (
        <div className="absolute inset-0 bg-red-500/15 pointer-events-none" />
      )}
    </div>
  );
}
