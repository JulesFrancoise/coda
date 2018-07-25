// =====
// Delta: Window-based differenciation
// =====
//
// TODO: Write description
//

a = mousemove(doc)
	.resample(periodic(10))
  .withAttr({ samplerate: 100 })
  .biquad({ f0: 5 })
  .plot({ legend: 'Mouse Position'})
	.delta({ size: 5 })
  .plot({ legend: 'Mouse velocity' })
	.delta({ size: 5 })
  .plot({ legend: 'Mouse acceleration' });
