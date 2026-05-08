import { useRef, useState, useEffect, useCallback } from "react";
import { examples, type ExampleEntry } from "../examples";

interface ToolbarProps {
  fileName: string;
  onFileOpen: (content: string, name: string) => void;
  onDownload: () => void;
}

export function Toolbar({ fileName, onFileOpen, onDownload }: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      onFileOpen(reader.result as string, file.name);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleExampleSelect = useCallback(
    (example: ExampleEntry) => {
      onFileOpen(example.content, example.fileName);
      setDropdownOpen(false);
    },
    [onFileOpen],
  );

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <header className="flex items-center gap-3 px-4 py-2 border-b border-gray-200 bg-white shrink-0">
      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 cursor-pointer"
      >
        Open
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".mei,.xml"
        onChange={handleFileSelect}
        className="hidden"
      />
      <button
        onClick={onDownload}
        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 cursor-pointer"
      >
        Download
      </button>
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 cursor-pointer"
        >
          Examples ▾
        </button>
        {dropdownOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 min-w-48">
            {examples.map((ex) => (
              <button
                key={ex.fileName}
                onClick={() => handleExampleSelect(ex)}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
              >
                {ex.name}
              </button>
            ))}
          </div>
        )}
      </div>
      <span className="text-sm text-gray-500 ml-auto truncate">{fileName}</span>
    </header>
  );
}
