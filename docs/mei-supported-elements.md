# Verovio MEI Supported Elements & Attribute Classes

> Source: [MEI supported elements | Reference book for Verovio](https://book.verovio.org/toolkit-reference/mei-support.html)
>
> Note: For the MEI attribute classes listed here, some attributes may not be implemented and not all possible attribute values are supported.

---

## Score Structure

| Element | Attribute Classes |
|---------|------------------|
| `<mdiv>` | `att.labelled`, `att.nNumberLike`, `att.typed` |
| `<score>` | `att.labelled`, `att.nNumberLike`, `att.typed` |
| `<scoreDef>` | `att.barring`, `att.distances`, `att.durationDefault`, `att.endings`, `att.lyricStyle`, `att.measureNumbers`, `att.midiTempo`, `att.mmTempo`, `att.multinumMeasures`, `att.octaveDefault`, `att.optimization`, `att.pianoPedals`, `att.spacing`, `att.systems`, `att.timeBase`, `att.tuning`, `att.typed` |
| `<section>` | `att.nNumberLike`, `att.section.vis`, `att.typed` |
| `<ending>` | `att.labelled`, `att.lineRend`, `att.lineRend.base`, `att.nNumberLike`, `att.typed` |
| `<expansion>` | `att.plist`, `att.typed` |
| `<staffGrp>` | `att.barring`, `att.basic`, `att.labelled`, `att.nNumberLike`, `att.staffGroupingSym`, `att.staffGrp.vis`, `att.typed` |
| `<staffDef>` | `att.barring`, `att.distances`, `att.durationDefault`, `att.labelled`, `att.lyricStyle`, `att.measureNumbers`, `att.midiTempo`, `att.mmTempo`, `att.multinumMeasures`, `att.nInteger`, `att.notationType`, `att.octaveDefault`, `att.pianoPedals`, `att.scalable`, `att.spacing`, `att.staffDef.log`, `att.staffDef.vis`, `att.staffDefVisTablature`, `att.systems`, `att.timeBase`, `att.transposition`, `att.typed` |
| `<layerDef>` | `att.labelled`, `att.nInteger`, `att.typed` |
| `<grpSym>` | `att.color`, `att.grpSym.log`, `att.staffGroupingSym`, `att.startEndId`, `att.startId` |
| `<label>` | — |
| `<labelAbbr>` | — |
| `<pgHead>` | `att.formework`, `att.typed` |
| `<pgFoot>` | `att.formework`, `att.typed` |
| `<measure>` | `att.barring`, `att.coord`, `att.facsimile`, `att.measure.log`, `att.meterConformanceBar`, `att.nNumberLike`, `att.pointing`, `att.typed` |
| `<ossia>` | `att.typed` |
| `<oStaff>` | `att.coord`, `att.facsimile`, `att.nInteger`, `att.typed`, `att.visibility` |

## Musical Content

| Element | Attribute Classes |
|---------|------------------|
| `<staff>` | `att.coord`, `att.facsimile`, `att.nInteger`, `att.typed`, `att.visibility` |
| `<layer>` | `att.cue`, `att.nInteger`, `att.typed`, `att.visibility` |
| `<note>` | `att.altSym`, `att.augmentDots`, `att.beamSecondary`, `att.color`, `att.coloration`, `att.coord`, `att.cue`, `att.duration.ges`, `att.duration.log`, `att.duration.quality`, `att.duration.ratio`, `att.extSym.auth`, `att.extSym.names`, `att.facsimile`, `att.fermataPresent`, `att.graced`, `att.harmonicFunction`, `att.labelled`, `att.linking`, `att.midiVelocity`, `att.note.ges`, `att.noteHeads`, `att.noteVisMensural`, `att.octave`, `att.pitch`, `att.pitch.ges`, `att.staffIdent`, `att.staffLoc`, `att.staffLoc.pitched`, `att.stems`, `att.stems.cmn`, `att.stringtab`, `att.tiePresent`, `att.typed`, `att.visibility`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<rest>` | `att.altSym`, `att.augmentDots`, `att.beamSecondary`, `att.color`, `att.coord`, `att.cue`, `att.duration.ges`, `att.duration.log`, `att.duration.quality`, `att.duration.ratio`, `att.enclosingChars`, `att.extSym.auth`, `att.extSym.names`, `att.facsimile`, `att.fermataPresent`, `att.labelled`, `att.linking`, `att.restVisMensural`, `att.staffIdent`, `att.staffLoc`, `att.staffLoc.pitched`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<mRest>` | `att.color`, `att.coord`, `att.cue`, `att.cutout`, `att.facsimile`, `att.fermataPresent`, `att.labelled`, `att.linking`, `att.staffLoc`, `att.staffLoc.pitched`, `att.typed`, `att.visibility`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<mRpt>` | `att.color`, `att.coord`, `att.facsimile`, `att.labelled`, `att.linking`, `att.numberPlacement`, `att.numbered`, `att.typed` |
| `<mRpt2>` | `att.color`, `att.coord`, `att.facsimile`, `att.labelled`, `att.linking`, `att.typed` |
| `<multiRest>` | `att.color`, `att.coord`, `att.facsimile`, `att.labelled`, `att.linking`, `att.multiRest.vis`, `att.numberPlacement`, `att.numbered`, `att.staffLoc`, `att.staffLoc.pitched`, `att.typed`, `att.width` |
| `<multiRpt>` | `att.coord`, `att.facsimile`, `att.labelled`, `att.linking`, `att.numbered`, `att.typed` |
| `<halfmRpt>` | `att.color`, `att.coord`, `att.facsimile`, `att.labelled`, `att.linking`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<beatRpt>` | `att.beatRpt.log`, `att.beatRpt.vis`, `att.color`, `att.coord`, `att.facsimile`, `att.labelled`, `att.linking`, `att.typed` |
| `<mSpace>` | `att.coord`, `att.facsimile`, `att.labelled`, `att.linking`, `att.typed` |
| `<chord>` | `att.augmentDots`, `att.beamSecondary`, `att.chord.vis`, `att.color`, `att.coord`, `att.cue`, `att.duration.ges`, `att.duration.log`, `att.duration.quality`, `att.duration.ratio`, `att.facsimile`, `att.fermataPresent`, `att.graced`, `att.labelled`, `att.linking`, `att.staffIdent`, `att.stems`, `att.stems.cmn`, `att.tiePresent`, `att.typed`, `att.visibility` |
| `<beam>` | `att.beamRend`, `att.beamedWith`, `att.color`, `att.coord`, `att.cue`, `att.facsimile`, `att.labelled`, `att.linking`, `att.typed` |
| `<beamSpan>` | `att.altSym`, `att.beamRend`, `att.beamedWith`, `att.color`, `att.labelled`, `att.linking`, `att.partIdent`, `att.plist`, `att.staffIdent`, `att.startEndId`, `att.startId`, `att.timestamp.log`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<tuplet>` | `att.color`, `att.coord`, `att.duration.ratio`, `att.facsimile`, `att.labelled`, `att.linking`, `att.numberPlacement`, `att.tuplet.vis`, `att.typed` |
| `<bTrem>` | `att.coord`, `att.facsimile`, `att.labelled`, `att.linking`, `att.numberPlacement`, `att.numbered`, `att.tremForm`, `att.tremMeasured`, `att.typed` |
| `<fTrem>` | `att.coord`, `att.fTrem.vis`, `att.facsimile`, `att.labelled`, `att.linking`, `att.tremMeasured`, `att.typed` |
| `<graceGrp>` | `att.color`, `att.coord`, `att.facsimile`, `att.graceGrp.log`, `att.graced`, `att.labelled`, `att.linking`, `att.typed` |
| `<space>` | `att.augmentDots`, `att.beamSecondary`, `att.coord`, `att.duration.ges`, `att.duration.log`, `att.duration.quality`, `att.duration.ratio`, `att.facsimile`, `att.fermataPresent`, `att.labelled`, `att.linking`, `att.staffIdent`, `att.typed` |
| `<barLine>` | `att.barLine.log`, `att.barLine.vis`, `att.color`, `att.coord`, `att.facsimile`, `att.labelled`, `att.linking`, `att.nNumberLike`, `att.typed`, `att.visibility` |
| `<clef>` | `att.clef.log`, `att.clefShape`, `att.color`, `att.coord`, `att.enclosingChars`, `att.extSym.auth`, `att.extSym.names`, `att.facsimile`, `att.labelled`, `att.lineLoc`, `att.linking`, `att.octave`, `att.octaveDisplacement`, `att.staffIdent`, `att.typed`, `att.typography`, `att.visibility`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<keySig>` | `att.color`, `att.coord`, `att.facsimile`, `att.keySig.anl`, `att.keySig.log`, `att.keySig.vis`, `att.labelled`, `att.linking`, `att.pitch`, `att.typed`, `att.visibility` |
| `<meterSig>` | `att.color`, `att.coord`, `att.enclosingChars`, `att.extSym.names`, `att.facsimile`, `att.labelled`, `att.linking`, `att.meterSig.log`, `att.meterSig.vis`, `att.typed`, `att.typography`, `att.visibility` |
| `<meterSigGrp>` | `att.basic`, `att.coord`, `att.facsimile`, `att.labelled`, `att.linking`, `att.meterSigGrp.log`, `att.typed`, `att.visibility` |
| `<keyAccid>` | `att.accidental`, `att.color`, `att.coord`, `att.enclosingChars`, `att.extSym.auth`, `att.extSym.names`, `att.facsimile`, `att.labelled`, `att.linking`, `att.note.ges`, `att.octave`, `att.pitch`, `att.pitch.ges`, `att.staffLoc`, `att.staffLoc.pitched`, `att.typed` |
| `<accid>` | `att.accid.log`, `att.accidental`, `att.accidental.ges`, `att.color`, `att.coord`, `att.enclosingChars`, `att.extSym.auth`, `att.extSym.names`, `att.facsimile`, `att.labelled`, `att.linking`, `att.placementOnStaff`, `att.placementRelEvent`, `att.staffLoc`, `att.staffLoc.pitched`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<artic>` | `att.articulation`, `att.articulation.ges`, `att.color`, `att.coord`, `att.enclosingChars`, `att.extSym.auth`, `att.extSym.names`, `att.facsimile`, `att.labelled`, `att.linking`, `att.placementRelEvent`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<dot>` | `att.color`, `att.coord`, `att.dot.log`, `att.facsimile`, `att.labelled`, `att.linking`, `att.staffLoc`, `att.staffLoc.pitched`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<verse>` | `att.color`, `att.coord`, `att.facsimile`, `att.labelled`, `att.lang`, `att.linking`, `att.nInteger`, `att.placementRelStaff`, `att.typed`, `att.typography` |
| `<syl>` | `att.coord`, `att.facsimile`, `att.labelled`, `att.lang`, `att.linking`, `att.partIdent`, `att.staffIdent`, `att.startEndId`, `att.startId`, `att.syl.log`, `att.timestamp.log`, `att.typed`, `att.typography`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<syllable>` | `att.color`, `att.coord`, `att.facsimile`, `att.labelled`, `att.linking`, `att.slashCount`, `att.typed` |
| `<neume>` | `att.color`, `att.coord`, `att.facsimile`, `att.labelled`, `att.linking`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<nc>` | `att.augmentDots`, `att.beamSecondary`, `att.color`, `att.coord`, `att.curvatureDirection`, `att.duration.ges`, `att.duration.log`, `att.duration.quality`, `att.duration.ratio`, `att.facsimile`, `att.fermataPresent`, `att.intervalMelodic`, `att.labelled`, `att.linking`, `att.ncForm`, `att.note.ges`, `att.octave`, `att.pitch`, `att.pitch.ges`, `att.staffIdent`, `att.staffLoc`, `att.staffLoc.pitched`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<plica>` | `att.coord`, `att.facsimile`, `att.labelled`, `att.linking`, `att.plica.vis`, `att.typed` |
| `<liquescent>` | `att.color`, `att.coord`, `att.facsimile`, `att.labelled`, `att.linking`, `att.note.ges`, `att.octave`, `att.pitch`, `att.pitch.ges`, `att.staffLoc`, `att.staffLoc.pitched`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<divLine>` | `att.color`, `att.coord`, `att.divLine.log`, `att.extSym.auth`, `att.extSym.names`, `att.facsimile`, `att.labelled`, `att.linking`, `att.nNumberLike`, `att.typed`, `att.visibility`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<custos>` | `att.color`, `att.coord`, `att.extSym.auth`, `att.extSym.names`, `att.facsimile`, `att.labelled`, `att.linking`, `att.note.ges`, `att.octave`, `att.pitch`, `att.pitch.ges`, `att.staffLoc`, `att.staffLoc.pitched`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<mensur>` | `att.color`, `att.coord`, `att.cue`, `att.duration.ratio`, `att.facsimile`, `att.labelled`, `att.linking`, `att.mensur.vis`, `att.mensuralShared`, `att.slashCount`, `att.staffLoc`, `att.typed` |
| `<proport>` | `att.coord`, `att.duration.ratio`, `att.facsimile`, `att.labelled`, `att.linking`, `att.typed` |
| `<ligature>` | `att.coord`, `att.facsimile`, `att.labelled`, `att.ligature.vis`, `att.linking`, `att.typed` |
| `<tabGrp>` | `att.augmentDots`, `att.beamSecondary`, `att.coord`, `att.duration.ges`, `att.duration.log`, `att.duration.quality`, `att.duration.ratio`, `att.facsimile`, `att.fermataPresent`, `att.labelled`, `att.linking`, `att.staffIdent`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<tabDurSym>` | `att.coord`, `att.facsimile`, `att.labelled`, `att.linking`, `att.nNumberLike`, `att.stringtab`, `att.typed`, `att.visualOffsetVo` |
| `<oriscus>` | `att.color`, `att.coord`, `att.facsimile`, `att.labelled`, `att.linking`, `att.note.ges`, `att.octave`, `att.pitch`, `att.pitch.ges`, `att.staffLoc`, `att.staffLoc.pitched`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<quilisma>` | `att.color`, `att.coord`, `att.facsimile`, `att.labelled`, `att.linking`, `att.note.ges`, `att.octave`, `att.pitch`, `att.pitch.ges`, `att.staffLoc`, `att.staffLoc.pitched`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |

## Control Events

| Element | Attribute Classes |
|---------|------------------|
| `<slur>` | `att.altSym`, `att.color`, `att.curvature`, `att.labelled`, `att.layerIdent`, `att.lineRend.base`, `att.linking`, `att.partIdent`, `att.staffIdent`, `att.startEndId`, `att.startId`, `att.timestamp.log`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<tie>` | `att.altSym`, `att.color`, `att.curvature`, `att.labelled`, `att.lineRend.base`, `att.linking`, `att.partIdent`, `att.staffIdent`, `att.startEndId`, `att.startId`, `att.timestamp.log`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<hairpin>` | `att.altSym`, `att.color`, `att.hairpin.log`, `att.hairpin.vis`, `att.labelled`, `att.lineRend.base`, `att.linking`, `att.partIdent`, `att.placementRelStaff`, `att.staffIdent`, `att.startEndId`, `att.startId`, `att.timestamp.log`, `att.typed`, `att.verticalGroup`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<dynam>` | `att.altSym`, `att.color`, `att.enclosingChars`, `att.extender`, `att.labelled`, `att.lineRend.base`, `att.linking`, `att.midiValue`, `att.partIdent`, `att.placementRelStaff`, `att.staffIdent`, `att.startEndId`, `att.startId`, `att.timestamp.log`, `att.typed`, `att.verticalGroup`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<dir>` | `att.altSym`, `att.color`, `att.extender`, `att.labelled`, `att.lang`, `att.lineRend.base`, `att.linking`, `att.partIdent`, `att.placementRelStaff`, `att.staffIdent`, `att.startEndId`, `att.startId`, `att.timestamp.log`, `att.typed`, `att.verticalGroup`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<tempo>` | `att.altSym`, `att.color`, `att.extender`, `att.labelled`, `att.lang`, `att.linking`, `att.midiTempo`, `att.mmTempo`, `att.partIdent`, `att.placementRelStaff`, `att.staffIdent`, `att.startEndId`, `att.startId`, `att.timestamp.log`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<pedal>` | `att.altSym`, `att.color`, `att.extSym.auth`, `att.extSym.names`, `att.labelled`, `att.linking`, `att.partIdent`, `att.pedal.log`, `att.pedal.vis`, `att.placementRelStaff`, `att.staffIdent`, `att.startEndId`, `att.startId`, `att.timestamp.log`, `att.typed`, `att.verticalGroup`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<mordent>` | `att.altSym`, `att.color`, `att.enclosingChars`, `att.extSym.auth`, `att.extSym.names`, `att.labelled`, `att.linking`, `att.mordent.log`, `att.ornamentAccid`, `att.partIdent`, `att.placementRelStaff`, `att.staffIdent`, `att.startId`, `att.timestamp.log`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<trill>` | `att.altSym`, `att.color`, `att.enclosingChars`, `att.extSym.auth`, `att.extSym.names`, `att.extender`, `att.labelled`, `att.lineRend`, `att.linking`, `att.nNumberLike`, `att.ornamentAccid`, `att.partIdent`, `att.placementRelStaff`, `att.staffIdent`, `att.startEndId`, `att.startId`, `att.timestamp.log`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<turn>` | `att.altSym`, `att.color`, `att.enclosingChars`, `att.extSym.auth`, `att.extSym.names`, `att.labelled`, `att.linking`, `att.ornamentAccid`, `att.partIdent`, `att.placementRelStaff`, `att.staffIdent`, `att.startId`, `att.timestamp.log`, `att.turn.log`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<fermata>` | `att.altSym`, `att.color`, `att.enclosingChars`, `att.extSym.auth`, `att.extSym.names`, `att.fermata.vis`, `att.labelled`, `att.linking`, `att.partIdent`, `att.placementRelStaff`, `att.staffIdent`, `att.startId`, `att.timestamp.log`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<arpeg>` | `att.altSym`, `att.arpeg.log`, `att.arpeg.vis`, `att.color`, `att.enclosingChars`, `att.labelled`, `att.linking`, `att.partIdent`, `att.plist`, `att.staffIdent`, `att.startId`, `att.timestamp.log`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<breath>` | `att.altSym`, `att.color`, `att.labelled`, `att.linking`, `att.partIdent`, `att.placementRelStaff`, `att.staffIdent`, `att.startId`, `att.timestamp.log`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<caesura>` | `att.altSym`, `att.color`, `att.extSym.auth`, `att.extSym.names`, `att.labelled`, `att.linking`, `att.partIdent`, `att.placementRelStaff`, `att.staffIdent`, `att.startId`, `att.timestamp.log`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<gliss>` | `att.altSym`, `att.color`, `att.labelled`, `att.lineRend`, `att.lineRend.base`, `att.linking`, `att.nNumberLike`, `att.partIdent`, `att.staffIdent`, `att.startEndId`, `att.startId`, `att.timestamp.log`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<harm>` | `att.altSym`, `att.color`, `att.labelled`, `att.lang`, `att.linking`, `att.nNumberLike`, `att.partIdent`, `att.placementRelStaff`, `att.staffIdent`, `att.startEndId`, `att.startId`, `att.timestamp.log`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<octave>` | `att.altSym`, `att.color`, `att.extender`, `att.labelled`, `att.lineRend`, `att.lineRend.base`, `att.linking`, `att.nNumberLike`, `att.octaveDisplacement`, `att.partIdent`, `att.staffIdent`, `att.startEndId`, `att.startId`, `att.timestamp.log`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<ornam>` | `att.altSym`, `att.color`, `att.labelled`, `att.linking`, `att.ornamentAccid`, `att.partIdent`, `att.placementRelStaff`, `att.staffIdent`, `att.startId`, `att.timestamp.log`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<reh>` | `att.altSym`, `att.color`, `att.labelled`, `att.lang`, `att.linking`, `att.partIdent`, `att.placementRelStaff`, `att.staffIdent`, `att.startId`, `att.timestamp.log`, `att.typed`, `att.verticalGroup`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<repeatMark>` | `att.altSym`, `att.color`, `att.extSym.auth`, `att.extSym.names`, `att.labelled`, `att.linking`, `att.partIdent`, `att.placementRelStaff`, `att.repeatMark.log`, `att.staffIdent`, `att.startId`, `att.timestamp.log`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<bracketSpan>` | `att.altSym`, `att.bracketSpan.log`, `att.color`, `att.labelled`, `att.lineRend`, `att.lineRend.base`, `att.linking`, `att.partIdent`, `att.staffIdent`, `att.startEndId`, `att.startId`, `att.timestamp.log`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<lv>` | `att.altSym`, `att.color`, `att.curvature`, `att.labelled`, `att.lineRend.base`, `att.linking`, `att.partIdent`, `att.staffIdent`, `att.startEndId`, `att.startId`, `att.timestamp.log`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<phrase>` | `att.altSym`, `att.color`, `att.curvature`, `att.labelled`, `att.layerIdent`, `att.lineRend.base`, `att.linking`, `att.partIdent`, `att.staffIdent`, `att.startEndId`, `att.startId`, `att.timestamp.log`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<fing>` | `att.altSym`, `att.color`, `att.labelled`, `att.linking`, `att.nNumberLike`, `att.partIdent`, `att.placementRelStaff`, `att.staffIdent`, `att.startId`, `att.timestamp.log`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<cpMark>` | `att.altSym`, `att.color`, `att.labelled`, `att.linking`, `att.partIdent`, `att.placementRelStaff`, `att.staffIdent`, `att.startEndId`, `att.startId`, `att.timestamp.log`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<mNum>` | `att.altSym`, `att.color`, `att.labelled`, `att.lang`, `att.linking`, `att.partIdent`, `att.placementRelStaff`, `att.staffIdent`, `att.startId`, `att.timestamp.log`, `att.typed`, `att.typography`, `att.visualOffsetHo`, `att.visualOffsetVo` |

## Figured Bass

| Element | Attribute Classes |
|---------|------------------|
| `<fb>` | — |
| `<f>` | `att.extender`, `att.labelled`, `att.partIdent`, `att.staffIdent`, `att.startEndId`, `att.startId`, `att.timestamp.log`, `att.typed` |

## Text & Annotations

| Element | Attribute Classes |
|---------|------------------|
| `<anchoredText>` | `att.altSym`, `att.color`, `att.labelled`, `att.linking`, `att.placementRelStaff`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<annot>` | `att.altSym`, `att.color`, `att.labelled`, `att.linking`, `att.partIdent`, `att.plist`, `att.staffIdent`, `att.startEndId`, `att.startId`, `att.timestamp.log`, `att.typed`, `att.visualOffsetHo`, `att.visualOffsetVo` |
| `<fig>` | `att.horizontalAlign`, `att.labelled`, `att.typed`, `att.verticalAlign` |
| `<rend>` | `att.color`, `att.extSym.auth`, `att.horizontalAlign`, `att.labelled`, `att.lang`, `att.nNumberLike`, `att.textRendition`, `att.typed`, `att.typography`, `att.verticalAlign`, `att.whitespace` |
| `<svg>` | — |
| `<symbol>` | `att.color`, `att.extSym.auth`, `att.extSym.names`, `att.labelled`, `att.typed`, `att.typography` |
| `<symbolDef>` | — |
| `<symbolTable>` | — |
| `<num>` | `att.labelled`, `att.typed` |
| `<lb>` | `att.labelled`, `att.typed` |
| `<div>` | `att.typed` |
| `<graphic>` | `att.height`, `att.pointing`, `att.typed`, `att.width` |

## Editorial

| Element | Attribute Classes |
|---------|------------------|
| `<abbr>` | `att.labelled`, `att.source`, `att.typed` |
| `<add>` | `att.labelled`, `att.source`, `att.typed` |
| `<app>` | `att.labelled`, `att.typed` |
| `<choice>` | `att.labelled`, `att.typed` |
| `<corr>` | `att.labelled`, `att.source`, `att.typed` |
| `<damage>` | `att.labelled`, `att.source`, `att.typed` |
| `<del>` | `att.labelled`, `att.source`, `att.typed` |
| `<expan>` | `att.labelled`, `att.source`, `att.typed` |
| `<lem>` | `att.labelled`, `att.source`, `att.typed` |
| `<orig>` | `att.labelled`, `att.source`, `att.typed` |
| `<rdg>` | `att.labelled`, `att.source`, `att.typed` |
| `<ref>` | `att.labelled`, `att.typed` |
| `<reg>` | `att.labelled`, `att.source`, `att.typed` |
| `<restore>` | `att.labelled`, `att.source`, `att.typed` |
| `<sic>` | `att.labelled`, `att.source`, `att.typed` |
| `<subst>` | `att.labelled`, `att.typed` |
| `<supplied>` | `att.labelled`, `att.source`, `att.typed` |
| `<unclear>` | `att.labelled`, `att.source`, `att.typed` |

## Layout & Facsimile

| Element | Attribute Classes |
|---------|------------------|
| `<pb>` | `att.facsimile`, `att.nNumberLike`, `att.typed` |
| `<sb>` | `att.facsimile`, `att.nNumberLike`, `att.typed` |
| `<facsimile>` | `att.typed` |
| `<surface>` | `att.coordinated`, `att.coordinatedUl`, `att.typed` |
| `<zone>` | `att.coordinated`, `att.coordinatedUl`, `att.typed` |

## Metadata

| Element | Attribute Classes |
|---------|------------------|
| `<instrDef>` | `att.channelized`, `att.labelled`, `att.midiInstrument`, `att.nNumberLike` |
| `<tuning>` | `att.tuning.log` |
| `<course>` | `att.accidental`, `att.nNumberLike`, `att.octave`, `att.pitch` |

---

## Summary

- **Total supported elements**: 128
- **Unique attribute classes**: 155

### Elements per category

| Category | Count |
|----------|-------|
| Score Structure | 17 |
| Musical Content | 45 |
| Control Events | 26 |
| Figured Bass | 2 |
| Text & Annotations | 12 |
| Editorial | 18 |
| Layout & Facsimile | 5 |
| Metadata | 3 |

---

## Attribute Class Index

All unique attribute classes and which elements use them.

| Attribute Class | Used by Elements |
|----------------|------------------|
| `att.accid.log` | `<accid>` |
| `att.accidental` | `<accid>`, `<course>`, `<keyAccid>` |
| `att.accidental.ges` | `<accid>` |
| `att.altSym` | `<anchoredText>`, `<annot>`, `<arpeg>`, `<beamSpan>`, `<bracketSpan>`, `<breath>`, `<caesura>`, `<cpMark>`, `<dir>`, `<dynam>`, `<fermata>`, `<fing>`, `<gliss>`, `<hairpin>`, `<harm>`, `<lv>`, `<mNum>`, `<mordent>`, `<note>`, `<octave>`, `<ornam>`, `<pedal>`, `<phrase>`, `<reh>`, `<repeatMark>`, `<rest>`, `<slur>`, `<tempo>`, `<tie>`, `<trill>`, `<turn>` |
| `att.arpeg.log` | `<arpeg>` |
| `att.arpeg.vis` | `<arpeg>` |
| `att.articulation` | `<artic>` |
| `att.articulation.ges` | `<artic>` |
| `att.augmentDots` | `<chord>`, `<nc>`, `<note>`, `<rest>`, `<space>`, `<tabGrp>` |
| `att.barLine.log` | `<barLine>` |
| `att.barLine.vis` | `<barLine>` |
| `att.barring` | `<measure>`, `<scoreDef>`, `<staffDef>`, `<staffGrp>` |
| `att.basic` | `<meterSigGrp>`, `<staffGrp>` |
| `att.beamRend` | `<beam>`, `<beamSpan>` |
| `att.beamSecondary` | `<chord>`, `<nc>`, `<note>`, `<rest>`, `<space>`, `<tabGrp>` |
| `att.beamedWith` | `<beam>`, `<beamSpan>` |
| `att.beatRpt.log` | `<beatRpt>` |
| `att.beatRpt.vis` | `<beatRpt>` |
| `att.bracketSpan.log` | `<bracketSpan>` |
| `att.channelized` | `<instrDef>` |
| `att.chord.vis` | `<chord>` |
| `att.clef.log` | `<clef>` |
| `att.clefShape` | `<clef>` |
| `att.color` | `<accid>`, `<anchoredText>`, `<annot>`, `<arpeg>`, `<artic>`, `<barLine>`, `<beam>`, `<beamSpan>`, `<beatRpt>`, `<bracketSpan>`, `<breath>`, `<caesura>`, `<chord>`, `<clef>`, `<cpMark>`, `<custos>`, `<dir>`, `<divLine>`, `<dot>`, `<dynam>`, `<fermata>`, `<fing>`, `<gliss>`, `<graceGrp>`, `<grpSym>`, `<hairpin>`, `<halfmRpt>`, `<harm>`, `<keyAccid>`, `<keySig>`, `<liquescent>`, `<lv>`, `<mNum>`, `<mRest>`, `<mRpt>`, `<mRpt2>`, `<mensur>`, `<meterSig>`, `<mordent>`, `<multiRest>`, `<nc>`, `<neume>`, `<note>`, `<octave>`, `<oriscus>`, `<ornam>`, `<pedal>`, `<phrase>`, `<quilisma>`, `<reh>`, `<rend>`, `<repeatMark>`, `<rest>`, `<slur>`, `<syllable>`, `<symbol>`, `<tempo>`, `<tie>`, `<trill>`, `<tuplet>`, `<turn>`, `<verse>` |
| `att.coloration` | `<note>` |
| `att.coord` | `<accid>`, `<artic>`, `<bTrem>`, `<barLine>`, `<beam>`, `<beatRpt>`, `<chord>`, `<clef>`, `<custos>`, `<divLine>`, `<dot>`, `<fTrem>`, `<graceGrp>`, `<halfmRpt>`, `<keyAccid>`, `<keySig>`, `<ligature>`, `<liquescent>`, `<mRest>`, `<mRpt>`, `<mRpt2>`, `<mSpace>`, `<measure>`, `<mensur>`, `<meterSig>`, `<meterSigGrp>`, `<multiRest>`, `<multiRpt>`, `<nc>`, `<neume>`, `<note>`, `<oStaff>`, `<oriscus>`, `<plica>`, `<proport>`, `<quilisma>`, `<rest>`, `<space>`, `<staff>`, `<syl>`, `<syllable>`, `<tabDurSym>`, `<tabGrp>`, `<tuplet>`, `<verse>` |
| `att.coordinated` | `<surface>`, `<zone>` |
| `att.coordinatedUl` | `<surface>`, `<zone>` |
| `att.cue` | `<beam>`, `<chord>`, `<layer>`, `<mRest>`, `<mensur>`, `<note>`, `<rest>` |
| `att.curvature` | `<lv>`, `<phrase>`, `<slur>`, `<tie>` |
| `att.curvatureDirection` | `<nc>` |
| `att.cutout` | `<mRest>` |
| `att.distances` | `<scoreDef>`, `<staffDef>` |
| `att.divLine.log` | `<divLine>` |
| `att.dot.log` | `<dot>` |
| `att.duration.ges` | `<chord>`, `<nc>`, `<note>`, `<rest>`, `<space>`, `<tabGrp>` |
| `att.duration.log` | `<chord>`, `<nc>`, `<note>`, `<rest>`, `<space>`, `<tabGrp>` |
| `att.duration.quality` | `<chord>`, `<nc>`, `<note>`, `<rest>`, `<space>`, `<tabGrp>` |
| `att.duration.ratio` | `<chord>`, `<mensur>`, `<nc>`, `<note>`, `<proport>`, `<rest>`, `<space>`, `<tabGrp>`, `<tuplet>` |
| `att.durationDefault` | `<scoreDef>`, `<staffDef>` |
| `att.enclosingChars` | `<accid>`, `<arpeg>`, `<artic>`, `<clef>`, `<dynam>`, `<fermata>`, `<keyAccid>`, `<meterSig>`, `<mordent>`, `<rest>`, `<trill>`, `<turn>` |
| `att.endings` | `<scoreDef>` |
| `att.extSym.auth` | `<accid>`, `<artic>`, `<caesura>`, `<clef>`, `<custos>`, `<divLine>`, `<fermata>`, `<keyAccid>`, `<mordent>`, `<note>`, `<pedal>`, `<rend>`, `<repeatMark>`, `<rest>`, `<symbol>`, `<trill>`, `<turn>` |
| `att.extSym.names` | `<accid>`, `<artic>`, `<caesura>`, `<clef>`, `<custos>`, `<divLine>`, `<fermata>`, `<keyAccid>`, `<meterSig>`, `<mordent>`, `<note>`, `<pedal>`, `<repeatMark>`, `<rest>`, `<symbol>`, `<trill>`, `<turn>` |
| `att.extender` | `<dir>`, `<dynam>`, `<f>`, `<octave>`, `<tempo>`, `<trill>` |
| `att.fTrem.vis` | `<fTrem>` |
| `att.facsimile` | `<accid>`, `<artic>`, `<bTrem>`, `<barLine>`, `<beam>`, `<beatRpt>`, `<chord>`, `<clef>`, `<custos>`, `<divLine>`, `<dot>`, `<fTrem>`, `<graceGrp>`, `<halfmRpt>`, `<keyAccid>`, `<keySig>`, `<ligature>`, `<liquescent>`, `<mRest>`, `<mRpt>`, `<mRpt2>`, `<mSpace>`, `<measure>`, `<mensur>`, `<meterSig>`, `<meterSigGrp>`, `<multiRest>`, `<multiRpt>`, `<nc>`, `<neume>`, `<note>`, `<oStaff>`, `<oriscus>`, `<pb>`, `<plica>`, `<proport>`, `<quilisma>`, `<rest>`, `<sb>`, `<space>`, `<staff>`, `<syl>`, `<syllable>`, `<tabDurSym>`, `<tabGrp>`, `<tuplet>`, `<verse>` |
| `att.fermata.vis` | `<fermata>` |
| `att.fermataPresent` | `<chord>`, `<mRest>`, `<nc>`, `<note>`, `<rest>`, `<space>`, `<tabGrp>` |
| `att.formework` | `<pgFoot>`, `<pgHead>` |
| `att.graceGrp.log` | `<graceGrp>` |
| `att.graced` | `<chord>`, `<graceGrp>`, `<note>` |
| `att.grpSym.log` | `<grpSym>` |
| `att.hairpin.log` | `<hairpin>` |
| `att.hairpin.vis` | `<hairpin>` |
| `att.harmonicFunction` | `<note>` |
| `att.height` | `<graphic>` |
| `att.horizontalAlign` | `<fig>`, `<rend>` |
| `att.intervalMelodic` | `<nc>` |
| `att.keySig.anl` | `<keySig>` |
| `att.keySig.log` | `<keySig>` |
| `att.keySig.vis` | `<keySig>` |
| `att.labelled` | `<abbr>`, `<accid>`, `<add>`, `<anchoredText>`, `<annot>`, `<app>`, `<arpeg>`, `<artic>`, `<bTrem>`, `<barLine>`, `<beam>`, `<beamSpan>`, `<beatRpt>`, `<bracketSpan>`, `<breath>`, `<caesura>`, `<choice>`, `<chord>`, `<clef>`, `<corr>`, `<cpMark>`, `<custos>`, `<damage>`, `<del>`, `<dir>`, `<divLine>`, `<dot>`, `<dynam>`, `<ending>`, `<expan>`, `<f>`, `<fTrem>`, `<fermata>`, `<fig>`, `<fing>`, `<gliss>`, `<graceGrp>`, `<hairpin>`, `<halfmRpt>`, `<harm>`, `<instrDef>`, `<keyAccid>`, `<keySig>`, `<layerDef>`, `<lb>`, `<lem>`, `<ligature>`, `<liquescent>`, `<lv>`, `<mNum>`, `<mRest>`, `<mRpt>`, `<mRpt2>`, `<mSpace>`, `<mdiv>`, `<mensur>`, `<meterSig>`, `<meterSigGrp>`, `<mordent>`, `<multiRest>`, `<multiRpt>`, `<nc>`, `<neume>`, `<note>`, `<num>`, `<octave>`, `<orig>`, `<oriscus>`, `<ornam>`, `<pedal>`, `<phrase>`, `<plica>`, `<proport>`, `<quilisma>`, `<rdg>`, `<ref>`, `<reg>`, `<reh>`, `<rend>`, `<repeatMark>`, `<rest>`, `<restore>`, `<score>`, `<sic>`, `<slur>`, `<space>`, `<staffDef>`, `<staffGrp>`, `<subst>`, `<supplied>`, `<syl>`, `<syllable>`, `<symbol>`, `<tabDurSym>`, `<tabGrp>`, `<tempo>`, `<tie>`, `<trill>`, `<tuplet>`, `<turn>`, `<unclear>`, `<verse>` |
| `att.lang` | `<dir>`, `<harm>`, `<mNum>`, `<reh>`, `<rend>`, `<syl>`, `<tempo>`, `<verse>` |
| `att.layerIdent` | `<phrase>`, `<slur>` |
| `att.ligature.vis` | `<ligature>` |
| `att.lineLoc` | `<clef>` |
| `att.lineRend` | `<bracketSpan>`, `<ending>`, `<gliss>`, `<octave>`, `<trill>` |
| `att.lineRend.base` | `<bracketSpan>`, `<dir>`, `<dynam>`, `<ending>`, `<gliss>`, `<hairpin>`, `<lv>`, `<octave>`, `<phrase>`, `<slur>`, `<tie>` |
| `att.linking` | `<accid>`, `<anchoredText>`, `<annot>`, `<arpeg>`, `<artic>`, `<bTrem>`, `<barLine>`, `<beam>`, `<beamSpan>`, `<beatRpt>`, `<bracketSpan>`, `<breath>`, `<caesura>`, `<chord>`, `<clef>`, `<cpMark>`, `<custos>`, `<dir>`, `<divLine>`, `<dot>`, `<dynam>`, `<fTrem>`, `<fermata>`, `<fing>`, `<gliss>`, `<graceGrp>`, `<hairpin>`, `<halfmRpt>`, `<harm>`, `<keyAccid>`, `<keySig>`, `<ligature>`, `<liquescent>`, `<lv>`, `<mNum>`, `<mRest>`, `<mRpt>`, `<mRpt2>`, `<mSpace>`, `<mensur>`, `<meterSig>`, `<meterSigGrp>`, `<mordent>`, `<multiRest>`, `<multiRpt>`, `<nc>`, `<neume>`, `<note>`, `<octave>`, `<oriscus>`, `<ornam>`, `<pedal>`, `<phrase>`, `<plica>`, `<proport>`, `<quilisma>`, `<reh>`, `<repeatMark>`, `<rest>`, `<slur>`, `<space>`, `<syl>`, `<syllable>`, `<tabDurSym>`, `<tabGrp>`, `<tempo>`, `<tie>`, `<trill>`, `<tuplet>`, `<turn>`, `<verse>` |
| `att.lyricStyle` | `<scoreDef>`, `<staffDef>` |
| `att.measure.log` | `<measure>` |
| `att.measureNumbers` | `<scoreDef>`, `<staffDef>` |
| `att.mensur.vis` | `<mensur>` |
| `att.mensuralShared` | `<mensur>` |
| `att.meterConformanceBar` | `<measure>` |
| `att.meterSig.log` | `<meterSig>` |
| `att.meterSig.vis` | `<meterSig>` |
| `att.meterSigGrp.log` | `<meterSigGrp>` |
| `att.midiInstrument` | `<instrDef>` |
| `att.midiTempo` | `<scoreDef>`, `<staffDef>`, `<tempo>` |
| `att.midiValue` | `<dynam>` |
| `att.midiVelocity` | `<note>` |
| `att.mmTempo` | `<scoreDef>`, `<staffDef>`, `<tempo>` |
| `att.mordent.log` | `<mordent>` |
| `att.multiRest.vis` | `<multiRest>` |
| `att.multinumMeasures` | `<scoreDef>`, `<staffDef>` |
| `att.nInteger` | `<layer>`, `<layerDef>`, `<oStaff>`, `<staff>`, `<staffDef>`, `<verse>` |
| `att.nNumberLike` | `<barLine>`, `<course>`, `<divLine>`, `<ending>`, `<fing>`, `<gliss>`, `<harm>`, `<instrDef>`, `<mdiv>`, `<measure>`, `<octave>`, `<pb>`, `<rend>`, `<sb>`, `<score>`, `<section>`, `<staffGrp>`, `<tabDurSym>`, `<trill>` |
| `att.ncForm` | `<nc>` |
| `att.notationType` | `<staffDef>` |
| `att.note.ges` | `<custos>`, `<keyAccid>`, `<liquescent>`, `<nc>`, `<note>`, `<oriscus>`, `<quilisma>` |
| `att.noteHeads` | `<note>` |
| `att.noteVisMensural` | `<note>` |
| `att.numberPlacement` | `<bTrem>`, `<mRpt>`, `<multiRest>`, `<tuplet>` |
| `att.numbered` | `<bTrem>`, `<mRpt>`, `<multiRest>`, `<multiRpt>` |
| `att.octave` | `<clef>`, `<course>`, `<custos>`, `<keyAccid>`, `<liquescent>`, `<nc>`, `<note>`, `<oriscus>`, `<quilisma>` |
| `att.octaveDefault` | `<scoreDef>`, `<staffDef>` |
| `att.octaveDisplacement` | `<clef>`, `<octave>` |
| `att.optimization` | `<scoreDef>` |
| `att.ornamentAccid` | `<mordent>`, `<ornam>`, `<trill>`, `<turn>` |
| `att.partIdent` | `<annot>`, `<arpeg>`, `<beamSpan>`, `<bracketSpan>`, `<breath>`, `<caesura>`, `<cpMark>`, `<dir>`, `<dynam>`, `<f>`, `<fermata>`, `<fing>`, `<gliss>`, `<hairpin>`, `<harm>`, `<lv>`, `<mNum>`, `<mordent>`, `<octave>`, `<ornam>`, `<pedal>`, `<phrase>`, `<reh>`, `<repeatMark>`, `<slur>`, `<syl>`, `<tempo>`, `<tie>`, `<trill>`, `<turn>` |
| `att.pedal.log` | `<pedal>` |
| `att.pedal.vis` | `<pedal>` |
| `att.pianoPedals` | `<scoreDef>`, `<staffDef>` |
| `att.pitch` | `<course>`, `<custos>`, `<keyAccid>`, `<keySig>`, `<liquescent>`, `<nc>`, `<note>`, `<oriscus>`, `<quilisma>` |
| `att.pitch.ges` | `<custos>`, `<keyAccid>`, `<liquescent>`, `<nc>`, `<note>`, `<oriscus>`, `<quilisma>` |
| `att.placementOnStaff` | `<accid>` |
| `att.placementRelEvent` | `<accid>`, `<artic>` |
| `att.placementRelStaff` | `<anchoredText>`, `<breath>`, `<caesura>`, `<cpMark>`, `<dir>`, `<dynam>`, `<fermata>`, `<fing>`, `<hairpin>`, `<harm>`, `<mNum>`, `<mordent>`, `<ornam>`, `<pedal>`, `<reh>`, `<repeatMark>`, `<tempo>`, `<trill>`, `<turn>`, `<verse>` |
| `att.plica.vis` | `<plica>` |
| `att.plist` | `<annot>`, `<arpeg>`, `<beamSpan>`, `<expansion>` |
| `att.pointing` | `<graphic>`, `<measure>` |
| `att.repeatMark.log` | `<repeatMark>` |
| `att.restVisMensural` | `<rest>` |
| `att.scalable` | `<staffDef>` |
| `att.section.vis` | `<section>` |
| `att.slashCount` | `<mensur>`, `<syllable>` |
| `att.source` | `<abbr>`, `<add>`, `<corr>`, `<damage>`, `<del>`, `<expan>`, `<lem>`, `<orig>`, `<rdg>`, `<reg>`, `<restore>`, `<sic>`, `<supplied>`, `<unclear>` |
| `att.spacing` | `<scoreDef>`, `<staffDef>` |
| `att.staffDef.log` | `<staffDef>` |
| `att.staffDef.vis` | `<staffDef>` |
| `att.staffDefVisTablature` | `<staffDef>` |
| `att.staffGroupingSym` | `<grpSym>`, `<staffGrp>` |
| `att.staffGrp.vis` | `<staffGrp>` |
| `att.staffIdent` | `<annot>`, `<arpeg>`, `<beamSpan>`, `<bracketSpan>`, `<breath>`, `<caesura>`, `<chord>`, `<clef>`, `<cpMark>`, `<dir>`, `<dynam>`, `<f>`, `<fermata>`, `<fing>`, `<gliss>`, `<hairpin>`, `<harm>`, `<lv>`, `<mNum>`, `<mordent>`, `<nc>`, `<note>`, `<octave>`, `<ornam>`, `<pedal>`, `<phrase>`, `<reh>`, `<repeatMark>`, `<rest>`, `<slur>`, `<space>`, `<syl>`, `<tabGrp>`, `<tempo>`, `<tie>`, `<trill>`, `<turn>` |
| `att.staffLoc` | `<accid>`, `<custos>`, `<dot>`, `<keyAccid>`, `<liquescent>`, `<mRest>`, `<mensur>`, `<multiRest>`, `<nc>`, `<note>`, `<oriscus>`, `<quilisma>`, `<rest>` |
| `att.staffLoc.pitched` | `<accid>`, `<custos>`, `<dot>`, `<keyAccid>`, `<liquescent>`, `<mRest>`, `<multiRest>`, `<nc>`, `<note>`, `<oriscus>`, `<quilisma>`, `<rest>` |
| `att.startEndId` | `<annot>`, `<beamSpan>`, `<bracketSpan>`, `<cpMark>`, `<dir>`, `<dynam>`, `<f>`, `<gliss>`, `<grpSym>`, `<hairpin>`, `<harm>`, `<lv>`, `<octave>`, `<pedal>`, `<phrase>`, `<slur>`, `<syl>`, `<tempo>`, `<tie>`, `<trill>` |
| `att.startId` | `<annot>`, `<arpeg>`, `<beamSpan>`, `<bracketSpan>`, `<breath>`, `<caesura>`, `<cpMark>`, `<dir>`, `<dynam>`, `<f>`, `<fermata>`, `<fing>`, `<gliss>`, `<grpSym>`, `<hairpin>`, `<harm>`, `<lv>`, `<mNum>`, `<mordent>`, `<octave>`, `<ornam>`, `<pedal>`, `<phrase>`, `<reh>`, `<repeatMark>`, `<slur>`, `<syl>`, `<tempo>`, `<tie>`, `<trill>`, `<turn>` |
| `att.stems` | `<chord>`, `<note>` |
| `att.stems.cmn` | `<chord>`, `<note>` |
| `att.stringtab` | `<note>`, `<tabDurSym>` |
| `att.syl.log` | `<syl>` |
| `att.systems` | `<scoreDef>`, `<staffDef>` |
| `att.textRendition` | `<rend>` |
| `att.tiePresent` | `<chord>`, `<note>` |
| `att.timeBase` | `<scoreDef>`, `<staffDef>` |
| `att.timestamp.log` | `<annot>`, `<arpeg>`, `<beamSpan>`, `<bracketSpan>`, `<breath>`, `<caesura>`, `<cpMark>`, `<dir>`, `<dynam>`, `<f>`, `<fermata>`, `<fing>`, `<gliss>`, `<hairpin>`, `<harm>`, `<lv>`, `<mNum>`, `<mordent>`, `<octave>`, `<ornam>`, `<pedal>`, `<phrase>`, `<reh>`, `<repeatMark>`, `<slur>`, `<syl>`, `<tempo>`, `<tie>`, `<trill>`, `<turn>` |
| `att.transposition` | `<staffDef>` |
| `att.tremForm` | `<bTrem>` |
| `att.tremMeasured` | `<bTrem>`, `<fTrem>` |
| `att.tuning` | `<scoreDef>` |
| `att.tuning.log` | `<tuning>` |
| `att.tuplet.vis` | `<tuplet>` |
| `att.turn.log` | `<turn>` |
| `att.typed` | `<abbr>`, `<accid>`, `<add>`, `<anchoredText>`, `<annot>`, `<app>`, `<arpeg>`, `<artic>`, `<bTrem>`, `<barLine>`, `<beam>`, `<beamSpan>`, `<beatRpt>`, `<bracketSpan>`, `<breath>`, `<caesura>`, `<choice>`, `<chord>`, `<clef>`, `<corr>`, `<cpMark>`, `<custos>`, `<damage>`, `<del>`, `<dir>`, `<div>`, `<divLine>`, `<dot>`, `<dynam>`, `<ending>`, `<expan>`, `<expansion>`, `<f>`, `<fTrem>`, `<facsimile>`, `<fermata>`, `<fig>`, `<fing>`, `<gliss>`, `<graceGrp>`, `<graphic>`, `<hairpin>`, `<halfmRpt>`, `<harm>`, `<keyAccid>`, `<keySig>`, `<layer>`, `<layerDef>`, `<lb>`, `<lem>`, `<ligature>`, `<liquescent>`, `<lv>`, `<mNum>`, `<mRest>`, `<mRpt>`, `<mRpt2>`, `<mSpace>`, `<mdiv>`, `<measure>`, `<mensur>`, `<meterSig>`, `<meterSigGrp>`, `<mordent>`, `<multiRest>`, `<multiRpt>`, `<nc>`, `<neume>`, `<note>`, `<num>`, `<oStaff>`, `<octave>`, `<orig>`, `<oriscus>`, `<ornam>`, `<ossia>`, `<pb>`, `<pedal>`, `<pgFoot>`, `<pgHead>`, `<phrase>`, `<plica>`, `<proport>`, `<quilisma>`, `<rdg>`, `<ref>`, `<reg>`, `<reh>`, `<rend>`, `<repeatMark>`, `<rest>`, `<restore>`, `<sb>`, `<score>`, `<scoreDef>`, `<section>`, `<sic>`, `<slur>`, `<space>`, `<staff>`, `<staffDef>`, `<staffGrp>`, `<subst>`, `<supplied>`, `<surface>`, `<syl>`, `<syllable>`, `<symbol>`, `<tabDurSym>`, `<tabGrp>`, `<tempo>`, `<tie>`, `<trill>`, `<tuplet>`, `<turn>`, `<unclear>`, `<verse>`, `<zone>` |
| `att.typography` | `<clef>`, `<mNum>`, `<meterSig>`, `<rend>`, `<syl>`, `<symbol>`, `<verse>` |
| `att.verticalAlign` | `<fig>`, `<rend>` |
| `att.verticalGroup` | `<dir>`, `<dynam>`, `<hairpin>`, `<pedal>`, `<reh>` |
| `att.visibility` | `<barLine>`, `<chord>`, `<clef>`, `<divLine>`, `<keySig>`, `<layer>`, `<mRest>`, `<meterSig>`, `<meterSigGrp>`, `<note>`, `<oStaff>`, `<staff>` |
| `att.visualOffsetHo` | `<accid>`, `<anchoredText>`, `<annot>`, `<arpeg>`, `<artic>`, `<beamSpan>`, `<bracketSpan>`, `<breath>`, `<caesura>`, `<clef>`, `<cpMark>`, `<custos>`, `<dir>`, `<divLine>`, `<dot>`, `<dynam>`, `<fermata>`, `<fing>`, `<gliss>`, `<hairpin>`, `<halfmRpt>`, `<harm>`, `<liquescent>`, `<lv>`, `<mNum>`, `<mRest>`, `<mordent>`, `<nc>`, `<neume>`, `<note>`, `<octave>`, `<oriscus>`, `<ornam>`, `<pedal>`, `<phrase>`, `<quilisma>`, `<reh>`, `<repeatMark>`, `<rest>`, `<slur>`, `<syl>`, `<tabGrp>`, `<tempo>`, `<tie>`, `<trill>`, `<turn>` |
| `att.visualOffsetVo` | `<accid>`, `<anchoredText>`, `<annot>`, `<arpeg>`, `<artic>`, `<beamSpan>`, `<bracketSpan>`, `<breath>`, `<caesura>`, `<clef>`, `<cpMark>`, `<custos>`, `<dir>`, `<divLine>`, `<dot>`, `<dynam>`, `<fermata>`, `<fing>`, `<gliss>`, `<hairpin>`, `<halfmRpt>`, `<harm>`, `<liquescent>`, `<lv>`, `<mNum>`, `<mRest>`, `<mordent>`, `<nc>`, `<neume>`, `<note>`, `<octave>`, `<oriscus>`, `<ornam>`, `<pedal>`, `<phrase>`, `<quilisma>`, `<reh>`, `<repeatMark>`, `<rest>`, `<slur>`, `<syl>`, `<tabDurSym>`, `<tabGrp>`, `<tempo>`, `<tie>`, `<trill>`, `<turn>` |
| `att.whitespace` | `<rend>` |
| `att.width` | `<graphic>`, `<multiRest>` |
