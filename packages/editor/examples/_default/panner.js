g = concatenative({
  file: 'drum-loop',
  periodAbs: 0.1,
});
g.index = periodic(200).rand().scale({ outmax: 8 }).map(x => Math.floor(x));

bc = panner({
  pan: 0 // -1 (left) to 1 (right)
});

g.connect(bc);
bc.connect();

bc.pan = periodic(10).rand()
  .biquad({ q: 30, f0: 0.25 })
  .scale({ outmin: -1 })
  .plot();
