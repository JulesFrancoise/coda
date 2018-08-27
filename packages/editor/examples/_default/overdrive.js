g = concatenative({
  file: 'drum-loop',
  periodAbs: 0.1,
});
g.index = periodic(200).rand().scale({ outmax: 8 }).map(x => Math.floor(x));

ov = overdrive({
  amount: 1,         // 0 to 1
  drive: 0.7,        // 0 to 1
  algorithmIndex: 0, // 0 to 5, selects one of our drive algorithms
  outputGain: 0.5,   // 0 to 1+
});

g.connect(ov);
ov.connect();

ov.amount = periodic(10).rand()
  .biquad({ q: 30, f0: 0.1 })
  .plot();
