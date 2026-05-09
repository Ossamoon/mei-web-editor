import { useEffect } from "react";

/**
 * Sets up window-level drag & drop to receive files.
 * Calls onDrop(content, fileName) when a file is dropped.
 */
export function useDragAndDrop(
  onDrop: (content: string, fileName: string) => void,
): void {
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer?.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        onDrop(reader.result as string, file.name);
      };
      reader.readAsText(file);
    };

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);
    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, [onDrop]);
}
