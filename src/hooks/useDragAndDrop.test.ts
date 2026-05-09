import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDragAndDrop } from "./useDragAndDrop";

describe("useDragAndDrop", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "FileReader",
      class {
        result: string | null = null;
        onload: (() => void) | null = null;
        readAsText() {
          this.result = "<mei>dropped content</mei>";
          this.onload?.();
        }
      },
    );
  });

  it("prevents default on dragover", () => {
    const onDrop = vi.fn();
    renderHook(() => useDragAndDrop(onDrop));

    const event = new Event("dragover", { cancelable: true });
    window.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it("calls onDrop with file content on drop", () => {
    const onDrop = vi.fn();
    renderHook(() => useDragAndDrop(onDrop));

    const file = new File(["<mei>test</mei>"], "dropped.mei", {
      type: "application/xml",
    });

    const event = new Event("drop", { cancelable: true }) as Event & {
      dataTransfer?: { files: File[] };
    };
    Object.defineProperty(event, "dataTransfer", {
      value: { files: [file] },
    });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(onDrop).toHaveBeenCalledWith("<mei>dropped content</mei>", "dropped.mei");
  });

  it("does nothing when no files in drop event", () => {
    const onDrop = vi.fn();
    renderHook(() => useDragAndDrop(onDrop));

    const event = new Event("drop", { cancelable: true }) as Event & {
      dataTransfer?: { files: File[] };
    };
    Object.defineProperty(event, "dataTransfer", {
      value: { files: [] },
    });

    window.dispatchEvent(event);

    expect(onDrop).not.toHaveBeenCalled();
  });

  it("cleans up event listeners on unmount", () => {
    const onDrop = vi.fn();
    const { unmount } = renderHook(() => useDragAndDrop(onDrop));

    unmount();

    const event = new Event("dragover", { cancelable: true });
    window.dispatchEvent(event);

    // dragover default should NOT be prevented after unmount
    // (Note: other listeners may still exist, so we check onDrop wasn't called for drop)
    const dropEvent = new Event("drop", { cancelable: true }) as Event & {
      dataTransfer?: { files: File[] };
    };
    Object.defineProperty(dropEvent, "dataTransfer", {
      value: {
        files: [new File(["test"], "test.mei")],
      },
    });
    window.dispatchEvent(dropEvent);

    expect(onDrop).not.toHaveBeenCalled();
  });
});
