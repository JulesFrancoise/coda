// =====
// Simplistic audio sampler engine.
// =====
//
// Sound samples can be triggered manually or from a boolean data stream
//

// Create a sampler engine and connect it to the main audio output
c = sampler({
  file: '15__anton__glass-a-ff', // associated audio file
  fadeTime: 0.005,               // fade in duration (s)
  speed: 1,                      // playback speed
  gain: 1,                       // playback gain
});
c.connect();

// Trigger playback
c.trigger = true;

// Periodically trigger the sample
c.trigger = periodic(500).map(() => true);

// Change playback speed
c.speed = periodic(20)
  .rand()
  .biquad({ f0: 0.2, q: 20 })
  .scale({ outmin: 0.25, outmax: 4 })
  .plot();
