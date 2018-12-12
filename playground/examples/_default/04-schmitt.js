// Example 4
// ====
//
// Schmitt trigger for discretizing continuous signals
// => Alt-Enter on the next text block to run
//

signal = periodic(10)
  .rand()
  .biquad({ q: 8 })
  .plot({ legend: 'Raw Signal'});
bin = signal
  .schmitt({ up: 0.6, down: 0.4, continuous: true })
  .plot({ legend: 'Schmitt Trigger', fill: 'bottom' });

// Simplified version with a  single threshold

bin2 = signal.map(x => x > 0.6 ? 1 : 0).plot({ fill: 'bottom' });
