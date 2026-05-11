import sampleMei from "./assets/sample.mei?raw";
import chordsMei from "./assets/example-chords.mei?raw";
import pianoMei from "./assets/example-piano.mei?raw";
import ornamentsMei from "./assets/example-ornaments.mei?raw";
import lyricsMei from "./assets/example-lyrics.mei?raw";
import dynamicsMei from "./assets/example-dynamics.mei?raw";
import pianoTechMei from "./assets/example-piano-techniques.mei?raw";
import repeatsMei from "./assets/example-repeats.mei?raw";
import specialMei from "./assets/example-special.mei?raw";

export interface ExampleEntry {
  name: string;
  fileName: string;
  content: string;
}

export const examples: ExampleEntry[] = [
  { name: "Basic Notation", fileName: "sample.mei", content: sampleMei },
  { name: "Chords & Voices", fileName: "example-chords.mei", content: chordsMei },
  { name: "Piano (Grand Staff)", fileName: "example-piano.mei", content: pianoMei },
  { name: "Ornaments & Articulations", fileName: "example-ornaments.mei", content: ornamentsMei },
  { name: "Melody with Lyrics", fileName: "example-lyrics.mei", content: lyricsMei },
  { name: "Dynamics & Expression", fileName: "example-dynamics.mei", content: dynamicsMei },
  { name: "Piano Techniques", fileName: "example-piano-techniques.mei", content: pianoTechMei },
  { name: "Repeats & Structure", fileName: "example-repeats.mei", content: repeatsMei },
  { name: "Tremolo & Harmony", fileName: "example-special.mei", content: specialMei },
];
