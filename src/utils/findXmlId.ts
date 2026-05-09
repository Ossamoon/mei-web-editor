import { SaxesParser } from "saxes";

// Module-level cache: avoids re-parsing on every cursor move
let cachedContent: string | null = null;
let cachedLineToId: (string | null)[] = [];

function buildLineToIdMap(content: string): (string | null)[] {
  const totalLines = content.split("\n").length;
  const lineToId: (string | null)[] = new Array(totalLines + 1).fill(null);

  const parser = new SaxesParser();
  const stack: { xmlId: string | null; startLine: number }[] = [];
  let pendingStartLine = 1;

  parser.on("opentagstart", () => {
    pendingStartLine = parser.line;
  });

  parser.on("opentag", (tag) => {
    const attrs = tag.attributes as Record<string, string>;
    const id = attrs["xml:id"] ?? null;
    stack.push({ xmlId: id, startLine: pendingStartLine });
  });

  parser.on("closetag", () => {
    const entry = stack.pop();
    if (!entry) return;

    const endLine = parser.line;
    const startLine = entry.startLine;

    // Find the nearest xml:id: self first, then walk up ancestors
    let effectiveId: string | null = entry.xmlId;
    if (!effectiveId) {
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].xmlId) {
          effectiveId = stack[i].xmlId;
          break;
        }
      }
    }

    // Assign to all lines in range, but only if not already set
    // (closetag fires innermost-first, so deeper elements are assigned first)
    if (effectiveId) {
      for (let line = startLine; line <= endLine; line++) {
        if (lineToId[line] === null) {
          lineToId[line] = effectiveId;
        }
      }
    }
  });

  parser.write(content);
  parser.close();

  return lineToId;
}

/**
 * Find the xml:id of the innermost element that owns the given cursor line.
 * Uses saxes to properly understand XML nesting, so closing tags
 * correctly resolve to their enclosing element's xml:id.
 */
export function findXmlIdAtCursor(
  content: string,
  line: number,
): string | null {
  if (!content) return null;

  const totalLines = content.split("\n").length;
  if (line < 1 || line > totalLines) return null;

  if (content !== cachedContent) {
    cachedContent = content;
    cachedLineToId = buildLineToIdMap(content);
  }

  return cachedLineToId[line] ?? null;
}
