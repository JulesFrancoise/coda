// Example 1A
// ====
//
// Resample the mouse position at a fixed sample rate
// => Alt-Enter on the next text block to run
//

c = mousemove(doc)
  .plot({ legend: 'Raw XY Mouse position (DOM Event)' });
cr = c
  .resample(periodic(10))
  .plot({ legend: 'XY Mouse position resampled at 100 Hz' });

// Example 1B
// ====
//
// Resample the mouse position from a stream of clicks
// => Alt-Enter on the next text block to run
//

x = mousemove(doc)
  .select(0)
  .plot({ legend: 'Mouse X position' });
xs = x
  .resample(click(doc))
  .tap(log);
