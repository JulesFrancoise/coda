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

//////////////////////////////////////////
// POLYPHONIC EXAMPLE
//////////////////////////////////////////

synth = granular({
  voices: 2,
  file: ['hendrix', 'twister'],
});
synth.connect();

synth.position = [0.2, 0.8];

synth.gain = [0, 1];
synth.gain = [1, 0];

synth.position = periodic(20).rand().biquad({ f0: 3, q: 2 }).plot();

synth.gain = [0, 0];
synth.gain = [, periodic(20).rand().biquad({ f0: 3, q: 2 }).plot()];

synth.gain = [periodic(20).rand().biquad({ f0: 3, q: 2 }).plot(),];
