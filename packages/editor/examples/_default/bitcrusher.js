g = concatenative({
  file: 'drum-loop',
  periodAbs: 0.1,
});
g.index = periodic(200).rand().scale({ outmax: 8 }).map(x => Math.floor(x));

bc = bitcrusher({
  bits: 4,          // 1 to 16
  normfreq: 1,    // 0 to 1
  bufferSize: 4096  // 256 to 16384
});

bc);
bc.connect();

bc.normfreq = 0.1;
bc.normfreq = periodic(10).rand().biquad({ q: 30, f0: 0.2 }).plot();
