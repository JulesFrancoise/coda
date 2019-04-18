// =====
// Convolution audio effect (e.g. for Reverb)
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

// Create a convolver with default parameters
// The audio file represents the impulse response of a particular room for a reverb FX.
conv = convolver({ file: 'reverb-StJohnChurch' });

// Connect the synth to the audio effect, then connect the effect to the main output
synth.connect(conv);
conv.connect();

// Dynamically change the impulse response
conv.file = 'reverb-LadyChapel';
conv.file = 'reverb-CarPark';

// Modulate Dry/Wet parameters
conv.drywet = periodic(100).rand().biquad({ f0: 0.2 }).plot();
