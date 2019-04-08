// =====
// Bitcrusher Audio Effect
// =====

// Create a concatenative synthesizer that randomly plays
// drum samples
synth = concatenative({
  file: 'drum-loop',
  periodAbs: 0.1,
});
synth.index = periodic(200)
  .rand()
  .scale({ outmax: 8 })
  .map(x => Math.floor(x));

// Create a bitcrusher with default parameters
bc = bitcrusher({
  bits: 4,         // 1 to 16
  normfreq: 1,     // 0 to 1
  bufferSize: 4096 // 256 to 16384
});

// Connect the synth to the audio effect, then connect the effect to the main output
synth.connect(bc);
bc.connect();

// Modulate the bitcrisher's parameters from reactive streams.
bc.normfreq = 0.1;
bc.normfreq = periodic(10).rand().biquad({ q: 30, f0: 0.2 }).plot();
