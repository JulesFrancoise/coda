// =====
// Chorus Audio Effect
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

// Create a chorus with default parameters
ch = chorus({
  rate: 1.5,     // Chorus rate (Hz)
  feedback: 0.2, // Feedback level
  delay: 0.45,   // Delay time (s)
});

// Connect the synth to the audio effect, then connect the effect to the main output
synth.connect(ch);
ch.connect();

// Modulate the chorus' feedback using a random data stream
ch.feedback = periodic(10).rand()
  .biquad({ q: 30, f0: 0.1 })
  .scale({ outmin: 0.7, outmax: 0.99 }).plot();
