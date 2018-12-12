// Example 11
// ====
//
// GMM-based posture classification
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
gmm = rec.gmmTrain({ regularizationAbs: 0.3 });

// Compute continuous recognition on the acceleration stream
likelihoods = acc.gmmPredict({ model: gmm })
  .plot({ legend: 'Likelihoods' });
