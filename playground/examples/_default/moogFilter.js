g = concatenative({
  file: 'drum-loop',
  periodAbs: 0.1,
});
g.index = periodic(200).rand().scale({ outmax: 8 }).map(x => Math.floor(x));

bc = moogFilter({
  cutoff: 0.065,     // 0 to 1
  resonance: 3.5,    // 0 to 4
  bufferSize: 4096   // 256 to 16384
});

g.connect(bc);
bc.connect();

bc.cutoff = periodic(10).rand()
  .biquad({ q: 30, f0: 0.2 })
  .clip({ min: 0.01, max: 0.99 })
  .plot();
