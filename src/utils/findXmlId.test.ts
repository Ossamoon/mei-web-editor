import { describe, it, expect } from "vitest";
import { findXmlIdAtCursor } from "./findXmlId";

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
});
