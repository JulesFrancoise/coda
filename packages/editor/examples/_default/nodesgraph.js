// =====
// Nodes: UI Component to record fragments of data with nodes and determine its trajectory
// =====
//
// TODO: Write description
//

a = periodic(20)
  .rand({ size: 2 })
  .biquad({ f0: 2 })
  .plot({ legend: 'Data Stream' })
  .nodes();
