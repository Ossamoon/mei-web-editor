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
    // Click on the score panel area (the container with SVG)
    const scorePanel = page.locator(".cursor-pointer").first();
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
