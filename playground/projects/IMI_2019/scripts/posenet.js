p = posenet({ parts: ['leftEye', 'rightEye', 'nose']});

leftEye = p.select([0, 1]);
rightEye = p.select([2, 3]);
nose = p.select([4, 5]);

features = pack([
  ...leftEye.sub(nose).unpack(),
  ...rightEye.sub(nose).unpack(),
]);

smoothed = features
  .resample(periodic(25))
	.mvavrg({ size: 12 })
  .plot({ stacked: true, legend: 'Joint positions' });

reco = smoothed.gmmPredict({
  model: smoothed.recorder().gmmTrain({ gaussians: 3, regularizationRel: 0.4 }),
  likelihoodWindow: 5,
}).plot({ legend: 'Posture Classification' });

// Create a texture synthtesizer, controlled by loudness
synth = catart({
  voices: 4,
  file: ['silence', 'water', 'fern', 'crispy-1'],
  periodRel: 0.2,
  durationRel: 4,
  gain: 1,
  positionVar: 0.1,
  repeat: false,
}).connect();

synth.target = reco.map(v => v.map(x => 0.9 * x + 0.1 * Math.random()));
// synth.resampling = e.scale({ outmax: -2400 });
