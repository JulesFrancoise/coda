// Example 10
// ====
//
// Concatenative Synthesis (The 'shaker')
//

// Get acceleration from the smartphone (change ID)
sm = smartphone('Jules');
acc = sm.acc
	.resample(periodic(10))
  .plot({ legend: 'Acceleration' });

// Compute the energy from the wavelet transform (in high frequencies)
e = acc.wavelet({ frequencyMin: 3, carrier: 2 }).sum().autoscale().plot();

// Create a concatenative synthesis engine
synth = catart({
  file: 'drum-loop',
}).connect();

synth.periodAbs = 0.15;
synth.target = e; // modulate the sound's energy with the movement
