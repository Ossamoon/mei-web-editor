import { SaxesParser } from "saxes";

export interface CursorContext {
  element: string;
  xmlId: string | null;
  attribute: string | null;
  text: string | null;
}

interface LineElementInfo {
  element: string;
  xmlId: string | null;
}

// Module-level cache
let cachedContent: string | null = null;
let cachedLineInfo: (LineElementInfo | null)[] = [];

function buildLineInfoMap(content: string): (LineElementInfo | null)[] {
  const totalLines = content.split("\n").length;
  const lineInfo: (LineElementInfo | null)[] = new Array(totalLines + 1).fill(null);

  const parser = new SaxesParser();
  const stack: { name: string; xmlId: string | null; startLine: number }[] = [];
  let pendingStartLine = 1;

  parser.on("opentagstart", () => {
    pendingStartLine = parser.line;
  });

  parser.on("opentag", (tag) => {
    const attrs = tag.attributes as Record<string, string>;
    const id = attrs["xml:id"] ?? null;
    stack.push({ name: tag.name, xmlId: id, startLine: pendingStartLine });
  });

  parser.on("closetag", () => {
    const entry = stack.pop();
    if (!entry) return;

    const endLine = parser.line;
    const startLine = entry.startLine;

    let effectiveId: string | null = entry.xmlId;
    if (!effectiveId) {
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].xmlId) {
          effectiveId = stack[i].xmlId;
          break;
        }
      }
    }

    for (let line = startLine; line <= endLine; line++) {
      if (lineInfo[line] === null) {
        lineInfo[line] = { element: entry.name, xmlId: effectiveId };
      }
    }
  });

  parser.write(content);
  parser.close();

  return lineInfo;
}

/**
 * Analyze a line of text at a specific column to determine
 * tag context, attribute, or text content.
 */
function analyzePosition(
  lineText: string,
  col: number,
): { tagName: string | null; attribute: string | null; text: string | null } {
  // Find all tag ranges on this line
  const tagRanges: { start: number; end: number; content: string }[] = [];
  let searchPos = 0;
  while (searchPos < lineText.length) {
    const lt = lineText.indexOf("<", searchPos);
    if (lt === -1) break;
    const gt = lineText.indexOf(">", lt);
    if (gt === -1) break;
    tagRanges.push({ start: lt, end: gt, content: lineText.slice(lt, gt + 1) });
    searchPos = gt + 1;
  }

  // Check if col is inside a tag
  const tag = tagRanges.find((r) => col >= r.start && col <= r.end);

  if (tag) {
    const isClosing = tag.content.startsWith("</");
    const nameMatch = tag.content.match(/^<\/?([a-zA-Z][\w:-]*)/);
    const tagName = nameMatch?.[1] ?? null;

    if (isClosing || !tagName) {
      return { tagName, attribute: null, text: null };
    }

    // Find attribute at col position
    const attrRegex = /([\w:-]+)=("[^"]*"|'[^']*')/g;
    let m;
    while ((m = attrRegex.exec(tag.content)) !== null) {
      const absStart = tag.start + m.index;
      const absEnd = absStart + m[0].length;
      if (col >= absStart && col < absEnd) {
        return { tagName, attribute: m[1], text: null };
      }
    }

    return { tagName, attribute: null, text: null };
  }

  // Not in a tag — extract text content at cursor position
  let textSegment: string | null = null;
  let prevEnd = 0;
  for (const r of tagRanges) {
    if (col >= prevEnd && col < r.start) {
      textSegment = lineText.slice(prevEnd, r.start).trim();
      break;
    }
    prevEnd = r.end + 1;
  }
  if (textSegment === null && col >= prevEnd) {
    textSegment = lineText.slice(prevEnd).trim();
  }

  return { tagName: null, attribute: null, text: textSegment || null };
}

/**
 * Find the XML element context at a specific cursor position.
 * Combines saxes-based line-level element mapping with
 * column-level tag/attribute/text analysis.
 */
export function findElementAtCursor(
  content: string,
  line: number,
  col: number,
): CursorContext | null {
  if (!content) return null;

  const lines = content.split("\n");
  if (line < 1 || line > lines.length) return null;

  if (content !== cachedContent) {
    cachedContent = content;
    cachedLineInfo = buildLineInfoMap(content);
  }

  const info = cachedLineInfo[line];
  const lineText = lines[line - 1];
  const position = analyzePosition(lineText, col);

  // Determine element: use tag at cursor if available, otherwise use line map
  const element = position.tagName ?? info?.element ?? null;
  if (!element) return null;

  return {
    element,
    xmlId: info?.xmlId ?? null,
    attribute: position.attribute,
    text: position.text,
  };
}
