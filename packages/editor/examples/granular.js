synth = granular({
  file: 'hendrix',
  position: 0.3,
});
synth.connect();

synth.position = 0.5;
synth.position = periodic(100).rand();

synth.resampling = -200;
synth.resampling = periodic(200).cycle([0, 0, 300, -200]);

synth.file = 'max-richter-1';

synth.stop();

clear();
