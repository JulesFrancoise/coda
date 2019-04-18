g = concatenative({
  file: 'drum-loop',
  periodAbs: 0.1,
});
g.index = periodic(200).rand().scale({ outmax: 8 }).map(x => Math.floor(x));

bc = pingpong({
  level: 0.5,      // 0 to 1
  feedback: 0.3,      // 0 to 1
  timeLeft: 150, // 1 to 10000 (milliseconds)
  timeRight: 200 // 1 to 10000 (milliseconds)
});

g.connect(bc);
bc.connect();
