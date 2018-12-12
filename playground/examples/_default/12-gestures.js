// Example 12
// ====
//
// HMM-based dynamic gesture recognition
//

// Get acceleration (including gravity) from the smartphone (change ID)
sm = smartphone('Jules');

acc = sm.accG
	.resample(periodic(10))
	.mvavrg({ size: 11 })
  .plot({ legend: 'Acceleration' });

// Create a recorder to capture some gestures (creates UI)
rec = acc.recorder();

// Train a GMM Model from recording events
hhmm = rec.hhmmTrain({ states: 12 });

// Compute continuous recognition on the acceleration stream
likelihoods = acc.hhmmPredict({ model: hhmm })
  .plot({ legend: 'Likelihoods' });
