import { describe, it, expect } from "vitest";
import { findXmlIdAtCursor, getAllXmlIds } from "./findXmlId";

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

describe("findXmlIdAtCursor", () => {
  it("returns xml:id on the current line", () => {
    // Line 10 has note with xml:id="n1"
    expect(findXmlIdAtCursor(sampleMei, 10)).toBe("n1");
  });

  it("returns xml:id of a different note", () => {
    // Line 11 has note with xml:id="n2"
    expect(findXmlIdAtCursor(sampleMei, 11)).toBe("n2");
  });

  it("returns measure id for measure line", () => {
    // Line 7 has measure with xml:id="m1"
    expect(findXmlIdAtCursor(sampleMei, 7)).toBe("m1");
  });

  it("walks up to find parent xml:id when cursor line has no id", () => {
    // Line 9 is <layer n="1"> which has no xml:id
    // Should walk up to find <staff> or <measure>
    const result = findXmlIdAtCursor(sampleMei, 9);
    // Staff has no id, but measure (line 7) has xml:id="m1"
    expect(result).toBe("m1");
  });

  it("returns null for empty content", () => {
    expect(findXmlIdAtCursor("", 1)).toBeNull();
  });

  it("returns null for line number out of range", () => {
    expect(findXmlIdAtCursor(sampleMei, 0)).toBeNull();
    expect(findXmlIdAtCursor(sampleMei, 999)).toBeNull();
  });

  it("returns null when no xml:id found walking up", () => {
    const xml = `<root>
  <child>
    <grandchild />
  </child>
</root>`;
    expect(findXmlIdAtCursor(xml, 3)).toBeNull();
  });

  it("returns null at the very first line with no id", () => {
    expect(findXmlIdAtCursor(sampleMei, 1)).toBeNull();
  });

  // --- Bug fix tests: closing tags should return parent's xml:id ---

  it("returns measure id on </layer> closing tag", () => {
    // Line 12 is </layer> — should return enclosing measure "m1", not sibling "n2"
    expect(findXmlIdAtCursor(sampleMei, 12)).toBe("m1");
  });

  it("returns measure id on </staff> closing tag", () => {
    // Line 13 is </staff> — should return enclosing measure "m1"
    expect(findXmlIdAtCursor(sampleMei, 13)).toBe("m1");
  });

  it("returns measure id on </measure> closing tag", () => {
    // Line 14 is </measure> — should return "m1" (the measure itself)
    expect(findXmlIdAtCursor(sampleMei, 14)).toBe("m1");
  });

  it("returns note id for child element inside a multi-line note", () => {
    const meiWithLyrics = `<mei>
  <music>
    <body>
      <mdiv>
        <score>
          <section>
            <measure n="1" xml:id="m1">
              <staff n="1">
                <layer n="1">
                  <note xml:id="n1" dur="4" oct="4" pname="f">
                    <verse n="1"><syl>Twin</syl></verse>
                  </note>
                </layer>
              </staff>
            </measure>
          </section>
        </score>
      </mdiv>
    </body>
  </music>
</mei>`;
    // Line 11 is <verse><syl>Twin</syl></verse> inside <note xml:id="n1"> — should return "n1"
    expect(findXmlIdAtCursor(meiWithLyrics, 11)).toBe("n1");
    // Line 12 is </note> — should still return "n1"
    expect(findXmlIdAtCursor(meiWithLyrics, 12)).toBe("n1");
  });

  it("returns correct measure id across multiple measures", () => {
    const twoMeasures = `<mei>
  <music>
    <body>
      <mdiv>
        <score>
          <section>
            <measure n="1" xml:id="m1">
              <staff n="1">
                <layer n="1">
                  <note xml:id="n1" dur="4" oct="4" pname="c" />
                </layer>
              </staff>
            </measure>
            <measure n="2" xml:id="m2">
              <staff n="1">
                <layer n="1">
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
    // Line 13 is </measure> of m1
    expect(findXmlIdAtCursor(twoMeasures, 13)).toBe("m1");
    // Line 14 is <measure n="2" xml:id="m2">
    expect(findXmlIdAtCursor(twoMeasures, 14)).toBe("m2");
    // Line 18 is </layer> inside m2 — should return "m2", not "n2"
    expect(findXmlIdAtCursor(twoMeasures, 18)).toBe("m2");
    // Line 20 is </measure> of m2
    expect(findXmlIdAtCursor(twoMeasures, 20)).toBe("m2");
  });

  it("returns null for structural elements above measure level", () => {
    // Line 6 is <section> — no xml:id above it
    expect(findXmlIdAtCursor(sampleMei, 6)).toBeNull();
    // Line 3 is <body>
    expect(findXmlIdAtCursor(sampleMei, 3)).toBeNull();
  });
});

describe("getAllXmlIds", () => {
  it("returns all xml:id values from MEI content", () => {
    const ids = getAllXmlIds(sampleMei);
    expect(ids).toEqual(new Set(["m1", "n1", "n2"]));
  });

  it("returns empty set for content with no xml:id", () => {
    const xml = `<root>
  <child>
    <grandchild />
  </child>
</root>`;
    expect(getAllXmlIds(xml)).toEqual(new Set());
  });

  it("returns empty set for empty string", () => {
    expect(getAllXmlIds("")).toEqual(new Set());
  });

  it("shares cache with findXmlIdAtCursor", () => {
    // Calling findXmlIdAtCursor first populates the cache
    findXmlIdAtCursor(sampleMei, 10);
    // getAllXmlIds should return correct results from the same cache
    const ids = getAllXmlIds(sampleMei);
    expect(ids).toEqual(new Set(["m1", "n1", "n2"]));
  });
});
