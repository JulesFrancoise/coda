// =====
// Schmitt Trigger
// =====
//
// A Schmitt Trigger binarizes a data stream using two thresholds (up and down)
// with hysteresis. It triggers 1 if the value exceeds the `up` threshold, and
// 0 if the values becomes lower to the `down` threshold.
//
// See https://en.wikipedia.org/wiki/Schmitt_trigger
//

a = periodic(10)
  .rand()
  .biquad({ f0: 5 })
  .plot({ legend: 'Raw Signal'})
  .schmitt({ up: 0.6, down: 0.4, continuous: true })
  .plot({ legend: 'Schmitt Trigger', fill: 'bottom' });

b = myo().emg
  .force()
  .sum()
  .throttle(20)
  .plot({ legend: 'EMG Force (global)'})
  .schmitt({ up: 1, down: 0.5, continuous: true })
  .plot({ legend: 'Schmitt Trigger', fill: 'bottom' });
