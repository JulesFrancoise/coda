// Example 5
// ====
//
// Compute the derivative of a signal
// => Alt-Enter on the next text block to run
//

mousePos = mousemove(doc)
  .resample(periodic(20))
  .mvavrg({ size: 5 })
  .plot({ legend: 'Mouse X/Y position (sampled at 50 Hz)' });
mousevel = mousePos
  .delta({ size: 3 })
  .plot({ legend: 'Mouse X/Y velocity' });
