/**
 * Find the xml:id at or near the given cursor line in MEI content.
 * First checks the current line, then walks up to find the nearest
 * enclosing element with an xml:id.
 */
export function findXmlIdAtCursor(
  content: string,
  line: number,
): string | null {
  if (!content) return null;

  const lines = content.split("\n");
  if (line < 1 || line > lines.length) return null;

  const cursorLineText = lines[line - 1];

  // Check current line for xml:id="..."
  const idMatch = cursorLineText.match(/xml:id="([^"]+)"/);
  if (idMatch) return idMatch[1];

  // Walk up to find nearest enclosing element with xml:id
  for (let i = line - 2; i >= 0; i--) {
    const lineText = lines[i];
    const parentId = lineText.match(/xml:id="([^"]+)"/);
    if (parentId) return parentId[1];
  }

  return null;
}
