import { describe, it, expect } from "vitest";
import { examples } from "./examples";
import { validateXml } from "./utils/validate";

describe("examples", () => {
  it("contains 5 examples", () => {
    expect(examples).toHaveLength(5);
  });

  it("each entry has required properties", () => {
    for (const entry of examples) {
      expect(entry).toHaveProperty("name");
      expect(entry).toHaveProperty("fileName");
      expect(entry).toHaveProperty("content");
      expect(entry.name.length).toBeGreaterThan(0);
      expect(entry.fileName).toMatch(/\.mei$/);
      expect(entry.content.length).toBeGreaterThan(0);
    }
  });

  it("each example contains valid XML", () => {
    for (const entry of examples) {
      const result = validateXml(entry.content);
      expect(result.valid, `${entry.name} should be valid`).toBe(true);
    }
  });

  it("each example contains MEI root element", () => {
    for (const entry of examples) {
      expect(entry.content).toContain("<mei");
      expect(entry.content).toContain("</mei>");
    }
  });

  it("has unique file names", () => {
    const fileNames = examples.map((e) => e.fileName);
    expect(new Set(fileNames).size).toBe(fileNames.length);
  });
});
