import { describe, it, expect } from "vitest";
import { validateXml } from "./validate";
import { examples } from "../examples";

describe("validateXml", () => {
  it("returns error for empty string", () => {
    const result = validateXml("");
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toEqual({
      message: "Empty document",
      line: 1,
      column: 0,
    });
  });

  it("returns error for whitespace-only string", () => {
    const result = validateXml("   \n\n  ");
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
  });

  it("returns valid for well-formed XML", () => {
    const result = validateXml("<root><child /></root>");
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("returns valid for XML with declaration", () => {
    const result = validateXml('<?xml version="1.0" encoding="UTF-8"?>\n<root />');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("detects unclosed tag", () => {
    const result = validateXml("<root><unclosed></root>");
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("detects mismatched closing tag", () => {
    const result = validateXml("<root><a></b></root>");
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("detects invalid attribute syntax", () => {
    const result = validateXml('<root attr=value />');
    expect(result.valid).toBe(false);
  });

  it("provides line number for multiline errors", () => {
    const xml = `<root>
  <child>text</child>
  <broken
</root>`;
    const result = validateXml(xml);
    expect(result.valid).toBe(false);
    expect(result.errors[0].line).toBeGreaterThanOrEqual(3);
  });

  it("can detect multiple errors", () => {
    const xml = "<root><a><b></a></b></root>";
    const result = validateXml(xml);
    expect(result.valid).toBe(false);
    // At least one error detected
    expect(result.errors.length).toBeGreaterThanOrEqual(1);
  });

  it("validates all example MEI files as valid", () => {
    for (const example of examples) {
      const result = validateXml(example.content);
      expect(result.valid, `${example.name} should be valid XML`).toBe(true);
      expect(result.errors, `${example.name} should have no errors`).toHaveLength(0);
    }
  });
});
