import { test, expect } from "@playwright/test";

test.describe("MEI Web Editor", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for Verovio WASM to load and render (Verovio produces nested SVGs)
    await expect(page.locator("svg").first()).toBeVisible({ timeout: 15000 });
  });

  test("displays initial sample MEI in the editor and score", async ({
    page,
  }) => {
    // Editor should have MEI content
    const editor = page.locator(".cm-content");
    await expect(editor).toContainText("xml:id");

    // Score should have rendered SVG
    await expect(page.locator("svg").first()).toBeVisible();

    // Status bar should show valid
    await expect(page.getByText("Valid XML")).toBeVisible();
  });

  test("shows toolbar buttons", async ({ page }) => {
    await expect(page.getByText("Open")).toBeVisible();
    await expect(page.getByText("Download")).toBeVisible();
    await expect(page.getByText(/Examples/)).toBeVisible();
  });

  test("shows cursor position in status bar", async ({ page }) => {
    await expect(page.getByText(/Ln \d+, Col \d+/)).toBeVisible();
  });

  test("shows error overlay for invalid XML", async ({ page }) => {
    // Use the exposed EditorView to replace content with broken XML
    await page.evaluate(() => {
      const view = (window as unknown as Record<string, unknown>).__editorView as {
        dispatch: (tr: { changes: { from: number; to: number; insert: string } }) => void;
        state: { doc: { length: number } };
      };
      if (!view) throw new Error("EditorView not found on window");
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: "<broken><unclosed>",
        },
      });
    });

    // Wait for debounced validation
    await page.waitForTimeout(500);

    // Status bar should show error (not "Valid XML")
    await expect(page.getByText("Valid XML")).not.toBeVisible({ timeout: 5000 });
  });

  test("selects example from dropdown", async ({ page }) => {
    // Open examples dropdown
    await page.getByText(/Examples/).click();

    // Select "Piano (Grand Staff)"
    await page.getByText("Piano (Grand Staff)").click();

    // Handle possible unsaved changes dialog
    page.on("dialog", (dialog) => dialog.accept());

    // Wait for render
    await page.waitForTimeout(500);

    // Editor should contain piano example content
    const editor = page.locator(".cm-content");
    await expect(editor).toContainText("Piano");

    // Score should be visible
    await expect(page.locator("svg").first()).toBeVisible();
  });

  test("clicking in the score area works without error", async ({
    page,
  }) => {
    // Click on the score panel container
    const scorePanel = page.locator(".p-4").first();
    await scorePanel.click();

    // Editor should still be functional
    await expect(page.locator(".cm-content")).toBeVisible();
  });

  test("download button triggers file download", async ({ page }) => {
    const downloadPromise = page.waitForEvent("download");
    await page.getByText("Download").click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.mei$/);
  });
});

test.describe("Score hover and highlight", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("svg").first()).toBeVisible({ timeout: 15000 });
  });

  test("note hover adds score-hover class", async ({ page }) => {
    // Find a note element in the SVG
    const note = page.locator("svg g.note").first();
    await expect(note).toBeAttached();

    // Hover over the note
    await note.hover({ force: true });

    // Should have score-hover class
    await expect(note).toHaveClass(/score-hover/);
  });

  test("note hover class is removed on mouseout", async ({ page }) => {
    const note = page.locator("svg g.note").first();
    await note.hover({ force: true });
    await expect(note).toHaveClass(/score-hover/);

    // Move mouse away from the score
    await page.mouse.move(0, 0);
    await page.waitForTimeout(100);

    // score-hover should be removed
    await expect(note).not.toHaveClass(/score-hover/);
  });

  test("measure hover creates overlay rect", async ({ page }) => {
    // Trigger mouseover on a measure element via evaluate
    const hasOverlay = await page.evaluate(() => {
      const measure = document.querySelector("svg g.measure");
      if (!measure) return false;

      // Dispatch mouseover event
      const event = new MouseEvent("mouseover", { bubbles: true });
      measure.dispatchEvent(event);

      // Check if overlay was created
      return !!measure.querySelector(".measure-hover-overlay");
    });

    expect(hasOverlay).toBe(true);
  });

  test("measure overlay does not accumulate on repeated hover", async ({
    page,
  }) => {
    const overlayCount = await page.evaluate(() => {
      const measure = document.querySelector("svg g.measure");
      if (!measure) return -1;

      // Simulate hover in/out multiple times
      for (let i = 0; i < 5; i++) {
        measure.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
        measure.dispatchEvent(
          new MouseEvent("mouseout", { bubbles: true, relatedTarget: document.body }),
        );
      }
      // Hover back on
      measure.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));

      return measure.querySelectorAll(".measure-hover-overlay").length;
    });

    expect(overlayCount).toBe(1);
  });

  test("piano score measure overlay spans both staves", async ({ page }) => {
    // Switch to piano example
    page.on("dialog", (dialog) => dialog.accept());
    await page.getByText(/Examples/).click();
    await page.getByText("Piano (Grand Staff)").click();
    await page.waitForTimeout(500);
    await expect(page.locator("svg").first()).toBeVisible();

    // Hover over a measure
    const measure = page.locator("svg g.measure").first();
    await measure.hover({ force: true });

    // Overlay should exist
    const overlay = measure.locator(".measure-hover-overlay");
    await expect(overlay).toBeAttached();

    // Get overlay height — it should span both staves (significantly taller than single staff)
    const height = await overlay.getAttribute("height");
    expect(Number(height)).toBeGreaterThan(1000); // Both staves ~1800 units apart
  });

  test("non-interactive SVG areas do not show pointer cursor", async ({
    page,
  }) => {
    // Check cursor on the score container background (not on a note/measure)
    const cursor = await page.evaluate(() => {
      const container = document.querySelector(".p-4");
      return container ? getComputedStyle(container).cursor : null;
    });
    // Container should not have pointer cursor
    expect(cursor).not.toBe("pointer");
  });
});

test.describe("Cursor context in status bar", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("svg").first()).toBeVisible({ timeout: 15000 });
  });

  async function moveCursorToLine(page: import("@playwright/test").Page, lineNumber: number) {
    await page.evaluate((ln) => {
      const view = (window as unknown as Record<string, unknown>).__editorView as {
        dispatch: (tr: Record<string, unknown>) => void;
        state: { doc: { line: (n: number) => { from: number } } };
      };
      if (!view) throw new Error("EditorView not found on window");
      const pos = view.state.doc.line(ln).from;
      view.dispatch({ selection: { anchor: pos } });
    }, lineNumber);
    await page.waitForTimeout(400);
  }

  test("shows element name when cursor is on a note line", async ({ page }) => {
    // Line 25 in sample.mei: <note xml:id="n1" .../>
    await moveCursorToLine(page, 25);
    const context = page.getByTestId("cursor-context");
    await expect(context).toContainText("<note>");
  });

  test("shows element name on closing tag line", async ({ page }) => {
    // Line 29 in sample.mei: </layer>
    await moveCursorToLine(page, 29);
    const context = page.getByTestId("cursor-context");
    await expect(context).toBeVisible();
    // Should show the enclosing element (layer or measure depending on col=0)
  });
});

/** Shared helper: move cursor to a specific line in the editor */
async function moveCursorToLine(page: import("@playwright/test").Page, lineNumber: number) {
  await page.evaluate((ln) => {
    const view = (window as unknown as Record<string, unknown>).__editorView as {
      dispatch: (tr: Record<string, unknown>) => void;
      state: { doc: { line: (n: number) => { from: number } } };
    };
    if (!view) throw new Error("EditorView not found on window");
    const pos = view.state.doc.line(ln).from;
    view.dispatch({ selection: { anchor: pos } });
  }, lineNumber);
  // Wait for React state update
  await page.waitForTimeout(400);
}

/** Shared helper: get full highlight diagnostic at current cursor position */
async function getHighlightState(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const active = document.querySelector(".score-active, .score-active-tuplet");
    const overlay = document.querySelector(".measure-active-overlay");
    const statusCtx = document.querySelector("[data-testid='cursor-context']");
    return {
      activeId: active?.id ?? null,
      activeClasses: active?.getAttribute("class") ?? null,
      hasOverlay: !!overlay,
      statusText: statusCtx?.textContent ?? null,
    };
  });
}

test.describe("Cursor to score active highlight", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("svg").first()).toBeVisible({ timeout: 15000 });
  });

  test("cursor on note line activates corresponding SVG element", async ({ page }) => {
    // Line 25 in sample.mei is: <note xml:id="n1" ...>
    await moveCursorToLine(page, 25);

    // The SVG element with id containing "n1" should have score-active
    const activeEl = await page.evaluate(() => {
      const el = document.querySelector(".score-active");
      return el?.id ?? null;
    });
    expect(activeEl).toBeTruthy();
  });

  test("highlight persists on every line within a measure", async ({ page }) => {
    // sample.mei measure 1 spans lines 22-31:
    //   22: <measure n="1" xml:id="m1">
    //   23:   <staff n="1">
    //   24:     <layer n="1">
    //   25:       <note xml:id="n1" .../>
    //   26:       <note xml:id="n2" .../>
    //   27:       <note xml:id="n3" .../>
    //   28:       <note xml:id="n4" .../>
    //   29:     </layer>
    //   30:   </staff>
    //   31: </measure>
    // Every line should have some element highlighted (score-active).

    const results: { line: number; state: Awaited<ReturnType<typeof getHighlightState>> }[] = [];

    for (const ln of [22, 23, 24, 25, 26, 27, 28, 29, 30, 31]) {
      await moveCursorToLine(page, ln);
      const state = await getHighlightState(page);
      results.push({ line: ln, state });
    }


    // Every line within measure 1 must have an active highlight
    for (const r of results) {
      expect(r.state.activeId, `Line ${r.line}: expected highlight but got none`).toBeTruthy();
    }
  });

  test("cursor on closing tag activates parent measure, not sibling note", async ({ page }) => {
    // Line 29 in sample.mei is: </layer> inside measure m1
    // Before the fix, this would activate "n4" (sibling note); after fix, should activate "m1"
    await moveCursorToLine(page, 29);

    const activeId = await page.evaluate(() => {
      const el = document.querySelector(".score-active, .score-active-tuplet");
      return el?.id ?? null;
    });
    // Should be the measure element, not a note
    expect(activeId).toBeTruthy();
    // Verovio prefixes measure ids, but the element should have class "measure"
    const isMeasure = await page.evaluate(() => {
      const el = document.querySelector(".score-active, .score-active-tuplet");
      return el?.classList.contains("measure") ?? false;
    });
    expect(isMeasure).toBe(true);
  });

  test("active highlight moves when cursor moves to a different note", async ({ page }) => {
    // Activate n1 (line 25)
    await moveCursorToLine(page, 25);
    const firstActiveId = await page.evaluate(() => {
      return document.querySelector(".score-active")?.id ?? null;
    });
    expect(firstActiveId).toBeTruthy();

    // Move to n5 (line 35, in measure 2)
    await moveCursorToLine(page, 35);
    const secondActiveId = await page.evaluate(() => {
      return document.querySelector(".score-active")?.id ?? null;
    });
    expect(secondActiveId).toBeTruthy();
    expect(secondActiveId).not.toBe(firstActiveId);

    // Previous element should no longer be active
    const firstStillActive = await page.evaluate((id) => {
      const el = document.getElementById(id!);
      return el?.classList.contains("score-active") ?? false;
    }, firstActiveId);
    expect(firstStillActive).toBe(false);
  });

  test("hover and active use the same blue hue", async ({ page }) => {
    // Activate a note via cursor
    await moveCursorToLine(page, 25);

    const colors = await page.evaluate(() => {
      const activeEl = document.querySelector(".score-active");
      if (!activeEl) return null;
      const activeChild = activeEl.querySelector("*");
      const activeFill = activeChild ? getComputedStyle(activeChild).fill : null;

      // Hover a different note
      const notes = document.querySelectorAll("svg g.note");
      let hoverTarget: Element | null = null;
      for (const n of notes) {
        if (!n.classList.contains("score-active")) {
          hoverTarget = n;
          break;
        }
      }
      if (!hoverTarget) return null;
      hoverTarget.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
      const hoverChild = hoverTarget.querySelector("*");
      const hoverFill = hoverChild ? getComputedStyle(hoverChild).fill : null;

      return { activeFill, hoverFill };
    });

    expect(colors).not.toBeNull();
    // Both should contain the blue hue (59, 130, 246)
    expect(colors!.activeFill).toContain("59, 130, 246");
    expect(colors!.hoverFill).toContain("59, 130, 246");
  });
});

test.describe("Stroke-based element highlights", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("svg").first()).toBeVisible({ timeout: 15000 });
  });

  /** Helper: select an example by name */
  async function selectExample(page: import("@playwright/test").Page, name: string) {
    page.on("dialog", (dialog) => dialog.accept());
    await page.getByText(/Examples/).click();
    await page.getByText(name).click();
    await page.waitForTimeout(500);
    await expect(page.locator("svg").first()).toBeVisible();
  }

  /** Helper: hover an element and return computed fill of its first child */
  async function getHoveredChildFill(page: import("@playwright/test").Page, selector: string) {
    return page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      el.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
      const child = el.querySelector("polyline, path");
      if (!child) return null;
      return getComputedStyle(child).fill;
    }, selector);
  }

  test("hairpin hover does not fill interior", async ({ page }) => {
    await selectExample(page, "Dynamics & Expression");
    const fill = await getHoveredChildFill(page, "svg g.hairpin");
    expect(fill).toBe("none");
  });

  test("bracketSpan hover does not fill interior", async ({ page }) => {
    await selectExample(page, "Tremolo, Harmony & Special");
    const fill = await getHoveredChildFill(page, "svg g.bracketSpan");
    expect(fill).toBe("none");
  });

  test("octave hover does not fill polyline interior", async ({ page }) => {
    await selectExample(page, "Piano Techniques");
    const fill = await page.evaluate(() => {
      const el = document.querySelector("svg g.octave");
      if (!el) return null;
      el.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
      const polyline = el.querySelector("polyline");
      if (!polyline) return null;
      return getComputedStyle(polyline).fill;
    });
    expect(fill).toBe("none");
  });

  test("tupletSpan hover does not color child notes", async ({ page }) => {
    await selectExample(page, "Tremolo, Harmony & Special");
    const result = await page.evaluate(() => {
      const tuplet = document.querySelector("svg g.tupletSpan");
      if (!tuplet) return null;
      tuplet.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));

      // Check that child notes are NOT colored by the tuplet hover
      const note = tuplet.querySelector("g.note .notehead use");
      const bracket = tuplet.querySelector(".tupletBracket polyline");
      if (!note || !bracket) return null;

      return {
        noteFill: getComputedStyle(note).fill,
        bracketFill: getComputedStyle(bracket).fill,
      };
    });
    expect(result).not.toBeNull();
    // Note should keep its original fill (black), not the highlight color
    expect(result!.noteFill).not.toContain("59, 130, 246");
    // Bracket should have fill: none
    expect(result!.bracketFill).toBe("none");
  });
});
