// Example: Wavelet Transform
// ====
//
// Computes a spectral analysis of the movement
//

m = smartphone('jules');

a = m.acc
  .resample(periodic(10))
  .plot({ legend: 'Acceleration' });
w = a.wavelet().heatmap({ legend: 'Online Continuous Wavelet Transform' });
