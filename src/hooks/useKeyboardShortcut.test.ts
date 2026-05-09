import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useKeyboardShortcut } from "./useKeyboardShortcut";

describe("useKeyboardShortcut", () => {
  it("calls callback on Ctrl+S", () => {
    const callback = vi.fn();
    renderHook(() => useKeyboardShortcut("s", callback));

    const event = new KeyboardEvent("keydown", {
      key: "s",
      ctrlKey: true,
      cancelable: true,
    });
    window.dispatchEvent(event);

    expect(callback).toHaveBeenCalledOnce();
  });

  it("calls callback on Cmd+S (metaKey)", () => {
    const callback = vi.fn();
    renderHook(() => useKeyboardShortcut("s", callback));

    const event = new KeyboardEvent("keydown", {
      key: "s",
      metaKey: true,
      cancelable: true,
    });
    window.dispatchEvent(event);

    expect(callback).toHaveBeenCalledOnce();
  });

  it("does not call callback for regular 's' key", () => {
    const callback = vi.fn();
    renderHook(() => useKeyboardShortcut("s", callback));

    const event = new KeyboardEvent("keydown", {
      key: "s",
      cancelable: true,
    });
    window.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();
  });

  it("does not call callback for wrong key with Ctrl", () => {
    const callback = vi.fn();
    renderHook(() => useKeyboardShortcut("s", callback));

    const event = new KeyboardEvent("keydown", {
      key: "a",
      ctrlKey: true,
      cancelable: true,
    });
    window.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();
  });

  it("cleans up event listener on unmount", () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useKeyboardShortcut("s", callback));

    unmount();

    const event = new KeyboardEvent("keydown", {
      key: "s",
      ctrlKey: true,
      cancelable: true,
    });
    window.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();
  });
});
