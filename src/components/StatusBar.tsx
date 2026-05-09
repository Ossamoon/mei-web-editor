import type { CursorContext } from "../utils/findElement";

interface StatusBarProps {
  isValid: boolean;
  errorMessage: string | null;
  verovioReady: boolean;
  cursorLine: number;
  cursorCol: number;
  cursorContext?: CursorContext | null;
}

function formatContext(ctx: CursorContext): string {
  let s = `<${ctx.element}>`;
  if (ctx.attribute) s += ` ${ctx.attribute}`;
  if (ctx.text) s += ` "${ctx.text}"`;
  if (ctx.xmlId) s += ` \u00B7 ${ctx.xmlId}`;
  return s;
}

export function StatusBar({
  isValid,
  errorMessage,
  verovioReady,
  cursorLine,
  cursorCol,
  cursorContext,
}: StatusBarProps) {
  return (
    <footer className="flex items-center gap-4 px-4 py-1 border-t border-gray-200 bg-white text-xs shrink-0">
      <div className="flex-1 truncate">
        {!verovioReady ? (
          <span className="text-gray-400">Loading Verovio...</span>
        ) : isValid ? (
          <span className="text-green-600">Valid XML</span>
        ) : (
          <span className="text-red-600 truncate" title={errorMessage ?? ""}>
            {errorMessage}
          </span>
        )}
      </div>
      {cursorContext && (
        <div className="text-gray-400 shrink-0" data-testid="cursor-context">
          {formatContext(cursorContext)}
        </div>
      )}
      <div className="text-gray-500 shrink-0">
        Ln {cursorLine}, Col {cursorCol}
      </div>
    </footer>
  );
}
