g = concatenative({
  file: 'drum-loop',
  periodAbs: 0.1,
});
g.index = periodic(200).rand().scale({ outmax: 8 }).map(x => Math.floor(x));

comp = compressor({
  threshold: -20,    // -100 to 0
  makeupGain: 1,     // 0 and up (in decibels)
  attack: 1,         // 0 to 1000
  release: 20,       // 0 to 3000
  ratio: 10,         // 1 to 20
  knee: 5,           // 0 to 40
  automakeup: true,
});

g.connect(comp);
comp.connect();

comp.drywet = 0;
comp.drywet = 1;
