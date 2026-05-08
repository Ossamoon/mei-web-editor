interface StatusBarProps {
  isValid: boolean;
  errorMessage: string | null;
  verovioReady: boolean;
  cursorLine: number;
  cursorCol: number;
}

export function StatusBar({
  isValid,
  errorMessage,
  verovioReady,
  cursorLine,
  cursorCol,
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
      <div className="text-gray-500 shrink-0">
        Ln {cursorLine}, Col {cursorCol}
      </div>
    </footer>
  );
}
