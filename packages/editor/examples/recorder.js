// =====
// Recorder: UI Component to record fragments of data to various buffers
// =====
//
// TODO: Write description
//

a = periodic(20)
  .rand({ size: 2 })
  .biquad({ f0: 2 })
  .plot({ legend: 'Data Stream' })
  .recorder();
