import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock ResizeObserver (not available in jsdom)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock URL.createObjectURL / revokeObjectURL
global.URL.createObjectURL = vi.fn(() => "blob:mock-url");
global.URL.revokeObjectURL = vi.fn();

// Mock Verovio modules
vi.mock("verovio/wasm", () => ({
  default: vi.fn(() =>
    Promise.resolve({ /* mock WASM module */ }),
  ),
}));

vi.mock("verovio/esm", () => ({
  VerovioToolkit: vi.fn().mockImplementation(() => ({
    setOptions: vi.fn(),
    loadData: vi.fn(() => true),
    getPageCount: vi.fn(() => 1),
    renderToSVG: vi.fn(
      () => '<svg id="page1"><g id="note-n1"><rect/></g></svg>',
    ),
  })),
}));
