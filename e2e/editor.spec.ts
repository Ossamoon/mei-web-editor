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
