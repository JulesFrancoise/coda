// Create a Catart-style descriptor-driven corpus-based concatenative synthesis using
// the corpus 'crispy-1'. Each corpus is composed of an audio file and a JSON file
// containing the time, duration of the segments, and associated descriptors
c = catart({
  file: 'crispy-1',
  descriptors: ['loudness'],
  k: 12,
  periodAbs: 0.05,
});
c.connect();

// Select the grains from a smooth random loudness signal
c.target = periodic(10).rand().biquad({ q: 30, f0: 0.5 }).plot();
