// =====
// Biquad Filtering
// =====
//
// Biquad FIR filter for data stream processing.
//

a = periodic(10)
  .rand()
  .plot({ legend: 'raw signal (random)' })
  .multicast();
b = a
  .biquad({ f0: 1 })
  .plot({ legend: 'lowpass filtered signal' });
c = a
  .biquad({ f0: 2, type: 'bandpass' })
  .plot({ legend: 'bandpass filtered signal' });
