// =====
// Delta: differentiate a data stream
// =====
//
// The `delta` operator computes a differentiation of an incoming stream of
// scalar or vector values over a fixed size window. It uses linear regression
// to estimate the slope of the signal over the given window.
//


// Compute mouse velocity/acceleration from a resampled version of the mouse position
a = mousemove(doc)
  .resample(periodic(10))
  .mvavrg({ size: 5 })
  .plot({ legend: 'Mouse Position'})
  .delta({ size: 5 })
  .plot({ legend: 'Mouse velocity' })
  .delta({ size: 5 })
  .plot({ legend: 'Mouse acceleration' });
