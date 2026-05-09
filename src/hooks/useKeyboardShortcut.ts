import { useEffect } from "react";

/**
 * Registers a Ctrl+S / Cmd+S keyboard shortcut that calls the given callback.
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
): void {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === key) {
        e.preventDefault();
        callback();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, callback]);
}
