g = granular({
  file: 'hendrix',
  period: 0.2,
  duration: 0.1,
});

ph = phaser({
  rate: 1.2,
  depth: 0.3,
  feedback: 0.2,
  stereoPhase: 30,
  baseModulationFrequency: 700,
});

g.connect(ph);
ph.connect();

g.position = periodic(10).rand()
  .biquad({ q: 30, f0: 0.1 })
  .plot();

ph.feedback = periodic(10).rand()
  .biquad({ q: 30, f0: 0.1 })
  .scale({ outmin: 0.7, outmax: 0.99 }).plot();
