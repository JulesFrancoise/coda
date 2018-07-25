// =====
// Looper: UI for recording and looping data fragments
// =====
//
// The looper UI component allows to record a fragment of the input stream and
// replay it periodically (events are then triggered by the input stream).
// Click on `record` to record a data segment, then `play` to loop it.
//

a = periodic(20)
  .rand({ size: 2 })
  .biquad({ f0: 2 })
  .plot({ legend: 'Input Signal' })
  .looper()
  .plot({ legend: 'Looped (or thru) Signal' });
