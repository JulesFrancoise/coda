// =====
// Heatmap: UI component for monitoring vector streams
// =====
//

// Mouse
a = mousemove(doc)
  .resample(periodic(10))
  .plot()
	.multicast();
b = a.wavelet({ bandsPerOctave: 8, frequencyMin: 0.2, optimisation: 'aggressive2' }).heatmap();
c = a.wavelet({ bandsPerOctave: 8, frequencyMin: 0.2, optimisation: 'standard2' }).heatmap();
// d = a.wavelet({ bandsPerOctave: 16, optimisation: 'none' }).heatmap();
