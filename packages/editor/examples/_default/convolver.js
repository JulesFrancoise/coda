synth = granular({
  file: 'hendrix',
  position: 0.3,
  period: 0.3,
  duration: 0.01,
});

conv = convolver({ file: 'reverb-StJohnChurch' });
del = delayy();

synth.connect(conv);
conv.connect(del);
del.connect();

conv.file = 'reverb-LadyChapel';
conv.file = 'reverb-CarPark';

conv.drywet = periodic(100).rand().biquad({ f0: 0.2 }).plot();

conv.file = 'reverb-CarPark';
