// =====
// Kick detection Example
// =====
//
// This example presents a simple kick detection method from any
// multidimensional signal. We use a wavelet transform to measure the signal's
// energy in a high frequency range (> 10 Hz). The derivation of the total
// energy allows us to track rapid changes. Onsets are finally detected using a
// Schmitt trigger.
//
// ---
// Additional notes:
// ---
// - Using a carrier frequency of 2 for the wavelet transform allows for higher
// time resolution. This also lowers the frequency resolution, which is not
// important for this example.
// - Using a high number of bands per octaves and standard optimisation is
// useful to ensure that the energy envelope is smooth
//

mouse = mousemove(doc)
  .resample(periodic(10))
  .plot({ legend: 'Raw mouse position (resample at 100 Hz)' })
  .multicast();
kick1 = mouse
  .wavelet({ bandsPerOctave: 8, carrier: 2, frequencyMin: 10, optimisation: 'standard2' })
  .heatmap({ legend: 'Wavelet Transform (10-50 Hz)' })
  .sum()
  .plot({ legend: 'Total Energy' })
  .delta()
  .plot({ legend: 'Derivation of the energy' })
  .schmitt({ up: 40, down: 30, continuous: true })
  .plot({ legend: 'Detected Kicks', fill: 'bottom' });
kick2 = mouse
  .kicks()
  .resample(periodic(10))
  .plot({ legend: 'Detected Kicks', fill: 'bottom' });
