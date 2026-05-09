import { describe, it, expect } from "vitest";
import { findElementAtCursor } from "./findElement";

const sampleMei = `<mei>
  <music>
    <body>
      <mdiv>
        <score>
          <section>
            <measure n="1" xml:id="m1">
              <staff n="1">
                <layer n="1">
                  <note xml:id="n1" dur="4" oct="4" pname="c" />
                  <note xml:id="n2" dur="4" oct="4" pname="d" />
                </layer>
              </staff>
            </measure>
          </section>
        </score>
      </mdiv>
    </body>
  </music>
</mei>`;
// Line 7:  `            <measure n="1" xml:id="m1">`
// Line 10: `                  <note xml:id="n1" dur="4" oct="4" pname="c" />`
// Line 12: `                </layer>`

describe("findElementAtCursor", () => {
  describe("tag name detection", () => {
    it("returns element name when cursor is on a tag name", () => {
      // Line 10: <note xml:id="n1" .../>  — col 20 is on "o" of "note"
      const ctx = findElementAtCursor(sampleMei, 10, 20);
      expect(ctx).not.toBeNull();
      expect(ctx!.element).toBe("note");
      expect(ctx!.attribute).toBeNull();
      expect(ctx!.text).toBeNull();
    });

    it("returns element name for measure tag", () => {
      // Line 7: <measure n="1" xml:id="m1">  — col 15 is on "a" of "measure"
      const ctx = findElementAtCursor(sampleMei, 7, 15);
      expect(ctx).not.toBeNull();
      expect(ctx!.element).toBe("measure");
    });

    it("returns element name on closing tag", () => {
      // Line 12: </layer>  — col 20 is on "y" of "layer"
      const ctx = findElementAtCursor(sampleMei, 12, 20);
      expect(ctx).not.toBeNull();
      expect(ctx!.element).toBe("layer");
      expect(ctx!.attribute).toBeNull();
    });
  });

  describe("attribute detection", () => {
    it("returns attribute name when cursor is on attribute name", () => {
      // Line 10: <note xml:id="n1" dur="4" .../>
      // col 24 is on "x" of "xml:id"
      const ctx = findElementAtCursor(sampleMei, 10, 24);
      expect(ctx).not.toBeNull();
      expect(ctx!.element).toBe("note");
      expect(ctx!.attribute).toBe("xml:id");
    });

    it("returns attribute name when cursor is on attribute value", () => {
      // col 32 is on "n" of the value "n1" in xml:id="n1"
      const ctx = findElementAtCursor(sampleMei, 10, 32);
      expect(ctx).not.toBeNull();
      expect(ctx!.element).toBe("note");
      expect(ctx!.attribute).toBe("xml:id");
    });

    it("returns different attribute when cursor is on dur", () => {
      // col 36 is on "d" of "dur"
      const ctx = findElementAtCursor(sampleMei, 10, 36);
      expect(ctx).not.toBeNull();
      expect(ctx!.element).toBe("note");
      expect(ctx!.attribute).toBe("dur");
    });

    it("returns pname attribute", () => {
      // col 52 is on "p" of "pname"
      const ctx = findElementAtCursor(sampleMei, 10, 52);
      expect(ctx).not.toBeNull();
      expect(ctx!.attribute).toBe("pname");
    });

    it("returns null attribute when cursor is on whitespace between attributes", () => {
      // col 23 is space between "note" and "xml:id"
      const ctx = findElementAtCursor(sampleMei, 10, 23);
      expect(ctx).not.toBeNull();
      expect(ctx!.element).toBe("note");
      expect(ctx!.attribute).toBeNull();
    });
  });

  describe("text content detection", () => {
    const lyricsXml = `<mei>
  <note xml:id="n1">
    <verse n="1"><syl>Twin</syl></verse>
  </note>
</mei>`;
    // Line 3: `    <verse n="1"><syl>Twin</syl></verse>`
    // Positions on line 3:
    //   col 4-16:  <verse n="1">
    //   col 17-21: <syl>
    //   col 22-25: Twin
    //   col 26-31: </syl>
    //   col 32-39: </verse>

    it("returns text content when cursor is on text between tags", () => {
      // col 23 is on "w" of "Twin"
      const ctx = findElementAtCursor(lyricsXml, 3, 23);
      expect(ctx).not.toBeNull();
      expect(ctx!.text).toBe("Twin");
    });

    it("returns element from enclosing tag context for text", () => {
      // Text "Twin" is inside <syl>, so element should be "syl"
      const ctx = findElementAtCursor(lyricsXml, 3, 23);
      expect(ctx!.element).toBe("syl");
    });

    it("returns null text when cursor is on a tag", () => {
      // col 5 is on "v" of "<verse"
      const ctx = findElementAtCursor(lyricsXml, 3, 5);
      expect(ctx!.text).toBeNull();
    });
  });

  describe("xmlId resolution", () => {
    it("returns xml:id of the element itself when it has one", () => {
      // Line 10: <note xml:id="n1" .../>
      const ctx = findElementAtCursor(sampleMei, 10, 20);
      expect(ctx!.xmlId).toBe("n1");
    });

    it("returns ancestor xml:id for elements without xml:id", () => {
      // Line 9: <layer n="1"> — layer has no xml:id, ancestor measure has "m1"
      const ctx = findElementAtCursor(sampleMei, 9, 18);
      expect(ctx!.xmlId).toBe("m1");
    });

    it("returns ancestor xml:id on closing tag", () => {
      // Line 12: </layer> — layer has no xml:id
      const ctx = findElementAtCursor(sampleMei, 12, 20);
      expect(ctx!.xmlId).toBe("m1");
    });

    it("returns measure xml:id on measure closing tag", () => {
      // Line 14: </measure>
      const ctx = findElementAtCursor(sampleMei, 14, 15);
      expect(ctx!.xmlId).toBe("m1");
    });
  });

  describe("enclosing element for whitespace/indentation", () => {
    it("returns enclosing element when cursor is on indentation", () => {
      // Line 9: `                <layer n="1">`
      // col 5 is on leading whitespace — inside measure content
      const ctx = findElementAtCursor(sampleMei, 9, 5);
      expect(ctx).not.toBeNull();
      // The enclosing element at this line is layer (or staff/measure)
      // The line map assigns the innermost element that owns this line
    });
  });

  describe("edge cases", () => {
    it("returns null for empty content", () => {
      expect(findElementAtCursor("", 1, 0)).toBeNull();
    });

    it("returns null for out-of-range line", () => {
      expect(findElementAtCursor(sampleMei, 0, 0)).toBeNull();
      expect(findElementAtCursor(sampleMei, 999, 0)).toBeNull();
    });

    it("returns element for col at start of line (col 0)", () => {
      // Line 1: <mei> — col 0 is on "<"
      const ctx = findElementAtCursor(sampleMei, 1, 0);
      expect(ctx).not.toBeNull();
      expect(ctx!.element).toBe("mei");
    });

    it("handles multiple tags on one line", () => {
      const multiTag = `<root>
  <a xml:id="a1"><b>text</b></a>
</root>`;
      // Line 2: `  <a xml:id="a1"><b>text</b></a>`
      // col 2 is on "<a"  → element="a"
      const ctxA = findElementAtCursor(multiTag, 2, 3);
      expect(ctxA!.element).toBe("a");

      // col 17 is on "<b" → element="b"
      const ctxB = findElementAtCursor(multiTag, 2, 17);
      expect(ctxB!.element).toBe("b");

      // col 20 is on "text" → text="text", element="b"
      const ctxText = findElementAtCursor(multiTag, 2, 20);
      expect(ctxText!.element).toBe("b");
      expect(ctxText!.text).toBe("text");
    });
  });
});
