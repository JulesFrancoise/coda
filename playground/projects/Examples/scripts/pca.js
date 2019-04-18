// =====
// PCA: project data to a lower dimensional space
// =====
//
// The PCA fit/predict components allow to record a fragment of the input stream and
// reduce linearly its dimensions using PCA for principal component analysis.
// Then you can project an input stream to a lower dimensional space.
// The PCA is implemted with the singular value decomposition method.
//
// In this example, a signal and the same signal noised are used to fit the model.
//

//Number of channels
nbchannel = 2;
// Number of dimension kept after the reduction by PCA
nbreduce = 3;

// Generate a smooth random signal
a = periodic(20)
  .rand({size :nbchannel})
  .biquad({ f0: 2 })
  .plot({ legend: 'Data Stream' });

// Generate a noisy random signal
bruit = periodic(80)
  .rand({size :nbchannel})
  .scale({ outmax: 0.1 })
  .plot({ legend: 'Noise'});

// Duplicate the smooth signal with the same signal where noised is add
b = pack(unpack(a).concat(unpack(a.add(bruit))))
  .plot({ stacked: true, legend: 'Signal and noisy signal' });

// b = pack(unpack(a).concat(unpack(a)))
//   .plot({ stacked: true, legend: 'Signal and noisy signal' });

// Setup a data recorder
c = b.recorder({ name: 'data' });

//  Fit the model dynamically when changes occur in the recorder
model = c.pcaTrain();

// Projection of the new stream on the new space reduced to 'nbreduce' dimensions
d = b.pcaPredict(model)
  .map(x => x.slice(0, nbreduce))
  .plot({ fill: 'bottom', stacked: true, legend: 'PCA reduction' });
