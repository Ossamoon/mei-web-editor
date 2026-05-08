import sampleMei from "./assets/sample.mei?raw";
import chordsMei from "./assets/example-chords.mei?raw";
import pianoMei from "./assets/example-piano.mei?raw";
import ornamentsMei from "./assets/example-ornaments.mei?raw";
import lyricsMei from "./assets/example-lyrics.mei?raw";

export interface ExampleEntry {
  name: string;
  fileName: string;
  content: string;
}

export const examples: ExampleEntry[] = [
  { name: "C Major Scale", fileName: "sample.mei", content: sampleMei },
  { name: "Chords & Voices", fileName: "example-chords.mei", content: chordsMei },
  { name: "Piano (Grand Staff)", fileName: "example-piano.mei", content: pianoMei },
  { name: "Ornaments & Articulations", fileName: "example-ornaments.mei", content: ornamentsMei },
  { name: "Melody with Lyrics", fileName: "example-lyrics.mei", content: lyricsMei },
];
