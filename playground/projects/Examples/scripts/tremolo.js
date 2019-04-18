g = granular({
  file: 'hendrix',
  position: 0.2,
});

tr = tremolo({
  intensity: 0.3,   // 0 to 1
  rate: 4,          // 0.001 to 8
  stereoPhase: 0,   // 0 to 180
});

g.connect(tr);
tr.connect();

tr.intensity = periodic(10).rand()
  .biquad({ q: 30, f0: 0.1 })
  .plot();

tr.rate = periodic(10).rand()
  .biquad({ q: 30, f0: 0.1 })
  .scale({ outmin: 0.01, outmax: 8 })
  .plot();
