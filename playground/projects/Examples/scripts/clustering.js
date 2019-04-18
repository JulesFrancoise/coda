// =====
// Clustering
// =====
//
// TODO: Write description
//

// Generate a smooth random signal
a = periodic(20)
  .rand({ size: 2 })
  .biquad({ f0: 2 })
  .plot({ legend: 'Data Stream' });

// Setup a data recorder
b = a.recorder({ name: 'data' });

// Dynamically train when changes occur in the recorder
model = b.gmmTrain({ gaussians: 3, ignoreLabels: true });

// Perform real-time recognition
c = a.gmmPredict({ model, output: 'beta' })
  .plot({ stacked: true, fill: 'bottom', legend: 'weights' })
