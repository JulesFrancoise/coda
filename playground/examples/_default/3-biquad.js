// Example 3
// ====
//
// Generate a square signal, then apply low-pass and high-pass filtering
// => Alt-Enter on the next text block to run
//

square = periodic(1000).cycle([0, 1]).resample(periodic(20)).plot();
lowpass = square
  .biquad({ q: 4 })
  .plot({ legend: 'Low-pass filtered signal' });
highpass = square
  .biquad({ type: 'highpass', f0: 0.2, q: 4 })
  .plot({ legend: 'Low-pass filtered signal' });
