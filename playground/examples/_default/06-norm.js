// Example 5
// ====
//
// Compute the norm of each event of a vector stream
// => Alt-Enter on the next text block to run
//

mousePos = mousemove(doc)
  .resample(periodic(20))
  .mvavrg({ size: 5 })
  .plot({ legend: 'Mouse X/Y position (sampled at 50 Hz)' });
mouseVel = mousePos
  .delta({ size: 3 })
  .plot({ legend: 'Mouse X/Y velocity' });
mouseVtot = mouseVel.norm().plot({ legend: 'Overall Mouse Velocity' });
