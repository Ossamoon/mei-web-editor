# Example Files

This document describes the 9 built-in MEI example files included in the editor.

## Overview

Examples are registered in [`src/examples.ts`](../src/examples.ts) and loaded as raw strings via Vite's `?raw` import. They appear in the **Examples ▾** dropdown in the toolbar.

Each file is located in `src/assets/` and serves a dual purpose:

1. **Pedagogical**: Demonstrates a specific MEI encoding feature in a musically meaningful context.
2. **Coverage**: Together, the 9 files cover all 38 CSS classes in `INTERACTIVE_CLASSES` ([`ScorePreview.tsx`](../src/components/ScorePreview.tsx)), ensuring every interactive element type can be visually tested via hover and click.

---

## File List

| # | Display Name | File | Key / Meter | Measures | Primary Focus |
|---|---|---|---|---|---|
| 1 | Basic Notation | `sample.mei` | C major · 4/4 | 8 + anacrusis | `note`, `rest`, `beam`, `measure` |
| 2 | Chords & Voices | `example-chords.mei` | G major · 4/4 | 8 | `chord`, multi-layer, `stem.dir` |
| 3 | Piano (Grand Staff) | `example-piano.mei` | G major · 3/4 | 8 | Grand staff, `staffGrp`, `slur` |
| 4 | Ornaments & Articulations | `example-ornaments.mei` | B♭ major · 4/4 | 8 | `trill`, `turn`, `mordent`, `fermata`, `slur`, `artic` |
| 5 | Melody with Lyrics | `example-lyrics.mei` | G major · 3/4 | 16 + anacrusis | `verse`, `syl`, `tuplet`, multi-verse lyrics |
| 6 | Dynamics & Expression | `example-dynamics.mei` | D minor · 4/4 | 8 | `tempo`, `dynam`, `hairpin`, `tie`, `phrase`, `breath`, `caesura`, `dir` |
| 7 | Piano Techniques | `example-piano-techniques.mei` | A♭ major · 4/4 | 8 | `arpeg`, `fing`, `mordent`, `pedal`, `octave`, `gliss`, `lv` |
| 8 | Repeats & Structure | `example-repeats.mei` | C major · 4/4 | 16 | `reh`, `repeatMark`, `mRpt`, `mRest`, `beatRpt`, `halfmRpt` |
| 9 | Tremolo, Harmony & Special | `example-special.mei` | C major · 4/4 | 8 | `bTrem`, `fTrem`, `harm`, `tupletSpan`, `beamSpan`, `bracketSpan`, `bend` |

---

## Per-Example Details

### 1. Basic Notation (`sample.mei`)

**Purpose:** Entry-level introduction to MEI note encoding.

**Musical form:** 8-measure melody in period form (antecedent ending on half cadence + consequent ending on authentic cadence), preceded by a one-beat anacrusis.

**MEI features demonstrated:**
- `note` — pitch, octave, duration attributes
- `rest` — explicit rest encoding
- `beam` — eighth-note grouping
- `dots="1"` — dotted durations (e.g. `dur="4" dots="1"` for a dotted quarter). Note: `dur` only accepts integer values; the shorthand `dur="4."` is **not** valid MEI.
- `metcon="false"` — anacrusis (pickup) measure marking
- `right="end"` — final barline

---

### 2. Chords & Voices (`example-chords.mei`)

**Purpose:** Shows how to encode polyphony using `chord` and multiple `layer` elements.

**Musical form:** 8-measure chorale-style passage in G major. Structured as two 4-measure phrases, each ending with a `fermata` on the final chord.

**MEI features demonstrated:**
- `chord` — multiple simultaneous pitches
- `layer n="1"` / `layer n="2"` — separate voices on a single staff
- `stem.dir` — explicit stem direction (`up` for upper voice, `down` for lower voice)
- `fermata` — phrase-ending holds on cadential chords

**Note:** All F notes in this file sound as F♯ due to `keysig="1s"`. No explicit `accid` attribute is needed on those notes.

---

### 3. Piano (Grand Staff) (`example-piano.mei`)

**Purpose:** Demonstrates the grand staff layout typical of piano music.

**Musical form:** 8-measure waltz (3/4) in G major with A + A′ phrase structure. The right hand carries a singable melody; the left hand plays an arpeggiated accompaniment.

**MEI features demonstrated:**
- `staffGrp symbol="brace"` — brace grouping for piano
- `bar.thru="true"` — barlines spanning both staves
- `staffDef` with G and F clefs (`clef.shape="G"` and `clef.shape="F"`)
- `slur` — phrase marking across measures

**Encoding note:** The `keysig="1s"` on both staves means all F pitches render as F♯. No `accid="s"` is written on individual notes (writing it would be redundant and inconsistent).

---

### 4. Ornaments & Articulations (`example-ornaments.mei`)

**Purpose:** Shows common ornament and articulation elements distributed across a full 8-measure phrase.

**Musical form:** Lyrical melody in B♭ major (2 flats: B♭, E♭). Ornaments are placed where they arise naturally in the melodic context, not artificially crammed into one measure.

**MEI features demonstrated:**

| Measure(s) | Elements |
|---|---|
| m1–2 | `slur`, `grace` note (`grace="unacc"`) |
| m3 | `trill` on a sustained note |
| m3–4 | `artic` values: `stacc`, `ten` (staccato, tenuto) |
| m5 | `turn`, `artic="marc"` (marcato) |
| m5–6 | `beam`, `artic="accent"` |
| m6 | `mordent` |
| m7 | `slur` |
| m8 | `fermata` |

**Encoding note:** `accid.ges="f"` on B♭ and E♭ notes is retained in this file. It records the sounding accidental explicitly (in addition to the key signature), which is useful for tools that perform pitch analysis independently of the key context.

---

### 5. Melody with Lyrics (`example-lyrics.mei`)

**Purpose:** Shows correct MEI lyric encoding with syllabification, melisma, and tuplets in a vocal context.

**Source:** *Amazing Grace*, John Newton (1779) — Public Domain. Melody: traditional (pre-1800).

**Musical form:** 16-measure melody in G major (1 sharp), 3/4 time, preceded by a one-beat anacrusis (D4). Covers the full first verse ("Amazing grace… was blind, but now I see.").

**Structure (ABC notation reference):**

| Measures | Notes | Lyric |
|---|---|---|
| m0 (pickup) | D4 q | "A-" |
| m1 | G h + triplet [B A G] | "-maz- -ing" |
| m2 | B h + B8 + A8 | "grace, how~" |
| m3 | G h + E q | "sweet the" |
| m4 | D h + D q | "sound / That" |
| m5 | G h + triplet [B A G] | "saved a~" |
| m6 | B h + A8 + B8 | "wretch like~" |
| m7 | D5 dh (tied) | "me." |
| m8 | D5 h (tie) + B8 + D8 | "~ / I~" |
| m9 | D5 h + triplet [B A G] | "once was~" |
| m10 | B h + B8 + A8 | "lost, but~" |
| m11 | G h + E q | "now am" |
| m12 | D h + D q | "found, / Was" |
| m13 | G h + triplet [B A G] | "blind, but~" |
| m14 | B h + B8 + A8 | "now I~" |
| m15 | G dh (tied) | "see." |
| m16 (short) | G h (tie) | "~" |

**MEI features demonstrated:**
- `verse n="1"` — lyric verse
- `syl` — syllable element, child of `verse`
- `wordpos` — syllable position: `i` (initial), `m` (medial), `t` (terminal)
- `con="d"` — dash connector between syllables of a word
- `con="u"` — underscore connector (melisma) when a syllable spans multiple notes
- `tuplet num="3" numbase="2"` — triplet eighth notes (3 in the time of 2)
- `metcon="false"` — anacrusis (m0) and short final measure (m16)
- `tie` — held note across barline (m7→m8, m15→m16)

**Syllabification rules applied:**
```
Single-syllable word:    <syl>word</syl>
Single-syllable melisma: <syl con="u">word</syl>   (underscore drawn to next note)
First syllable of word:  <syl wordpos="i" con="d">A-</syl>
Middle syllable:         <syl wordpos="m" con="d">-maz-</syl>
Final syllable:          <syl wordpos="t">-ing</syl>
```

**Multi-syllable word in this file:**
- "A-maz-ing" (m0–m1): `wordpos="i"` (pickup D) → `wordpos="m"` (G half) → `wordpos="t"` (B of triplet)

---

### 6. Dynamics & Expression (`example-dynamics.mei`)

**Purpose:** Covers the full range of dynamic, temporal, and phrase-level expression elements. These elements are interactive in `ScorePreview` and all appear in `INTERACTIVE_CLASSES`.

**Musical form:** 8-measure melody in D minor forming a single arc: quiet opening → forte climax → quiet close.

**MEI features demonstrated (by measure):**

| Measure(s) | Elements |
|---|---|
| m1 | `tempo` (Andante espressivo), `dynam` (p) |
| m2 | `hairpin form="cres"` (crescendo) |
| m3 | `dynam` (f), `dir` (espressivo), `phrase` |
| m4 | `hairpin form="dim"` (diminuendo), `breath` at phrase end |
| m5 | `dynam` (pp), `tie` across barline |
| m6 | `phrase` |
| m7 | `dir` (rit.), `caesura` |
| m8 | `dynam` (ppp), `fermata` |

**Encoding notes:**
- `breath` and `caesura` appear in different musical contexts (m4 and m7 respectively), reflecting their distinct meanings: `breath` = short breathing pause within a phrase; `caesura` = a more definitive break between phrases.
- `tie` connects two notes of the same pitch across a barline (`startid` in m5 → `endid` in m6). The tied note is G4 in both measures.

---

### 7. Piano Techniques (`example-piano-techniques.mei`)

**Purpose:** Demonstrates piano-specific notation on a grand staff: arpeggios, fingering, pedal, 8va, glissando, and let-vibrate.

**Musical form:** 8-measure piano miniature in A♭ major (4 flats: B♭, E♭, A♭, D♭). Grand staff with treble and bass clef.

**MEI features demonstrated (by section):**

| Measure(s) | Elements |
|---|---|
| m1–2 | `arpeg` (arpeggiated chord), `pedal dir="down"` / `pedal dir="up"` |
| m3–4 | `mordent`, `fing` (fingering numbers), `pedal` pair |
| m5–6 | `octave dis="8" dis.place="above"` (8va bracket), `gliss` |
| m7–8 | `chord`, `lv` (laissez vibrer / let vibrate), `pedal` |

**Encoding notes:**
- Every `pedal dir="down"` is paired with a corresponding `pedal dir="up"` later in the piece, reflecting correct pianistic notation.
- `octave` spans notes across measures. The `staff="1"` attribute scopes it to the treble staff only.
- `arpeg` is applied at the `chord` element level via `startid="#chN"`.
- All A♭, E♭, D♭ notes use `accid.ges="f"` to record the sounding accidental.

---

### 8. Repeats & Structure (`example-repeats.mei`)

**Purpose:** Demonstrates all MEI repeat and structural navigation elements. This is the longest example at 16 measures.

**Musical form:** A – B – C – D structure in C major, 4/4. Section A uses repeat barlines; Section B uses `segno`; Sections C and D include various repeat shorthand symbols.

**MEI features demonstrated (by section):**

| Section | Measures | Elements |
|---|---|---|
| A | m1–4 | `reh` (rehearsal mark "A"), `right="rptstart"` / `right="rptend"` |
| B | m5–8 | `reh` ("B"), `repeatMark func="segno"`, `halfmRpt` |
| C | m9–12 | `mRpt` (full measure repeat), `mRest` (full measure rest), `beatRpt` |
| D | m13–16 | `repeatMark func="dalSegno"` (D.S. — returns to the segno in m5) |

**Encoding notes:**
- `right="rptstart"` / `right="rptend"` are placed on individual `measure` elements to produce start-repeat and end-repeat barlines.
- `repeatMark func="dalSegno"` at m16 is paired with `func="segno"` at m5 — semantically consistent (D.S. returns to the segno, not to the beginning as D.C. would).
- `mRpt` (m10) repeats m9. `mRest` (m11) is a full-measure rest — distinct from `mRpt`.
- `beatRpt` (m12) repeats the previous beat pattern.
- `halfmRpt` (m7) repeats the first two beats of that measure.

---

### 9. Tremolo, Harmony & Special (`example-special.mei`)

**Purpose:** Groups less common notation elements that do not fit cleanly into the other categories. All elements in this file appear in `INTERACTIVE_CLASSES`.

**Musical form:** 8-measure passage in C major / A minor, 4/4. Chord symbols (`harm`) appear throughout to provide harmonic context.

**MEI features demonstrated (by section):**

| Measure(s) | Elements |
|---|---|
| m1–2 | `bTrem` (notated tremolo on a single note), `harm` (chord symbol), `ornam` |
| m3–4 | `fTrem` (fingered/alternating tremolo between two notes), `harm` |
| m5–6 | `tupletSpan` (triplet: 3 eighth notes in the time of 2), `harm` |
| m6 | `beamSpan` (explicit beam grouping via control element) |
| m7 | `bend`, `bracketSpan`, `harm` |
| m8 | `harm` |

**Encoding notes:**

- **`tupletSpan`** uses `num="3" numbase="2"`: three `dur="8"` notes occupy the time of two eighth notes (= one quarter note beat). The three notes occupy exactly 1 beat, leaving the remaining 3 quarter-note beats for other notes. This is the correct way to encode a triplet using `tupletSpan`.

- **`bTrem`** wraps a single note — it denotes a tremolo ornament on that note (rapid repetition).

- **`fTrem`** wraps two notes — it denotes alternation between the two pitches.

- **`bracketSpan`** draws an analytical bracket above a group of notes.

- **`beamSpan`** is a control element alternative to the inline `beam` element. It allows beaming across notes that cannot be grouped with a single `beam` wrapper (e.g. across element boundaries).

---

## INTERACTIVE_CLASSES Coverage Map

The table below shows which example file is the **primary source** for each CSS class in `INTERACTIVE_CLASSES`. A class is covered if at least one element with that class appears in the Verovio-rendered SVG.

| Class | Primary Example |
|---|---|
| `note` | 1 Basic Notation |
| `rest` | 1 Basic Notation |
| `measure` | All |
| `chord` | 2 Chords & Voices |
| `trill` | 4 Ornaments |
| `turn` | 4 Ornaments |
| `fermata` | 4 Ornaments |
| `slur` | 4 Ornaments |
| `tempo` | 6 Dynamics |
| `dynam` | 6 Dynamics |
| `hairpin` | 6 Dynamics |
| `tie` | 6 Dynamics |
| `phrase` | 6 Dynamics |
| `breath` | 6 Dynamics |
| `caesura` | 6 Dynamics |
| `dir` | 6 Dynamics |
| `arpeg` | 7 Piano Techniques |
| `mordent` | 7 Piano Techniques |
| `fing` | 7 Piano Techniques |
| `pedal` | 7 Piano Techniques |
| `octave` | 7 Piano Techniques |
| `gliss` | 7 Piano Techniques |
| `lv` | 7 Piano Techniques |
| `mRest` | 8 Repeats |
| `mRpt` | 8 Repeats |
| `beatRpt` | 8 Repeats |
| `halfmRpt` | 8 Repeats |
| `reh` | 8 Repeats |
| `repeatMark` | 8 Repeats |
| `ornam` | 9 Special |
| `harm` | 9 Special |
| `bTrem` | 9 Special |
| `fTrem` | 9 Special |
| `tupletSpan` | 9 Special |
| `beamSpan` | 9 Special |
| `bracketSpan` | 9 Special |
| `bend` | 9 Special |

---

## Adding or Modifying Examples

1. Add a `.mei` file to `src/assets/`.
2. Import it with `?raw` in `src/examples.ts`.
3. Add an `ExampleEntry` object to the `examples` array.
4. If any new `INTERACTIVE_CLASSES` are needed, add the CSS class to both `INTERACTIVE_CLASSES` and the `<style>` block in `ScorePreview.tsx`.
5. Run `pnpm test --run` to confirm the example count and XML validity checks pass.

## Design Constraints

- **Count**: Tests assert exactly 9 examples (`examples.test.ts` line 7). Adjust the assertion if you add or remove files.
- **Valid XML**: Each file is validated by the SAX-based `validateXml` utility on load. Malformed XML will surface as a lint error in the editor but also causes the test `each example contains valid XML` to fail.
- **MEI root**: Each file must contain `<mei` and `</mei>` (checked by test).
- **Unique file names**: Duplicate `fileName` values are rejected by test.
