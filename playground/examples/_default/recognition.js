// =====
// TODO
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
model = b.hmmTrain({ states: 7, gaussians: 1 });

// Perform real-time recognition
c = a.hmmPredict({ model })
  .plot({ fill: 'bottom', stacked: true, legend: 'HMM recognition' });
