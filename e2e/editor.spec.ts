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
