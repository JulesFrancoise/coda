// Example 2
// ====
//
// Generate a noisy signal, then apply moving average filtering
// => Alt-Enter on the next text block to run
//

noise = periodic(10).rand().scale({ outmax: 0.1 });
noisySignal = periodic(10)
  .rand()
  .biquad({ q: 4 })
	.add(noise)
	.plot({ legend: 'Noisy signal'});
b = noisySignal
  .mvavrg({ size: 20 })
	.plot({ legend: 'Smoothed signal' });
