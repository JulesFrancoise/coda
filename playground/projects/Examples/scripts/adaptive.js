// =====
// Adaptively rescale a data stream
// =====
//
// The adaptive operator performs normalization of an incoming scalar or vector stream.
// The min/max bounds of the incoming signal are continuously re-estimated on a given
// duration, with a given refresh rate.
//

options = {
  duration: 10, // Duration (s) of the sliding window on which to compute the min/max bounds
  refresh: 2,   // Refresh rate (s) of the min/max estimation
};

// Generate a random signal and apply adaptive scaling
a = periodic(10)
  .rand({size : 2})
  .biquad({ f0: 1 })
  .plot()
  .adaptive(options)
  .plot();
