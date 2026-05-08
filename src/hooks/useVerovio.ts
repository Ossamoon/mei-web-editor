import { useEffect, useRef, useState, useCallback } from "react";
import createVerovioModule from "verovio/wasm";
import { VerovioToolkit } from "verovio/esm";

export function useVerovio() {
  const toolkitRef = useRef<VerovioToolkit | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const VerovioModule = await createVerovioModule();
      if (cancelled) return;
      toolkitRef.current = new VerovioToolkit(VerovioModule);
      setIsReady(true);
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const renderMei = useCallback(
    (meiData: string, width: number): string | null => {
      const tk = toolkitRef.current;
      if (!tk || !meiData.trim()) return null;

      tk.setOptions({
        pageWidth: Math.max(100, Math.round(width * (100 / 40))),
        pageMarginTop: 20,
        pageMarginLeft: 20,
        pageMarginRight: 20,
        pageMarginBottom: 20,
        scale: 40,
        adjustPageHeight: true,
      });

      if (!tk.loadData(meiData)) return null;

      const pageCount = tk.getPageCount();
      const pages: string[] = [];
      for (let i = 1; i <= pageCount; i++) {
        pages.push(tk.renderToSVG(i));
      }
      return pages.join("");
    },
    [],
  );

  return { isReady, renderMei };
}
