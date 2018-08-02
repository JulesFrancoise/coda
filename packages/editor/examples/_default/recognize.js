// =====
// Recorder: UI Component to record fragments of data to various buffers
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
model = b.train({ type: 'GMM', gaussians: 3 });

// Perform real-time recognition
c = a.recognize({ model })
  .plot({ fill: 'bottom', stacked: true, legend: 'HMM recognition' });
