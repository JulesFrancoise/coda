// =====
// Schmitt Trigger
// =====
//
// TODO: Write description
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
