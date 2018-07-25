# Examples

This page provides a few basic examples of use of the `mars` library. Further examples are available within the `solar` live-coding playground, available online:
https://liveonmars.netlify.com/

### Basic example

Generate a 100Hz random signal, and apply two different biquad filters: a lowpass biquad filter of 1 Hz cutoff frequency, and a bandpass filter with 2 Hz cutoff frequency.

```javascript
const a = mars.periodic(10)
.rand()
.plot({ legend: 'raw signal (random)' })
.multicast();
const b = a
.biquad({ f0: 1 })
.plot({ legend: 'lowpass filtered signal' });
const c = a
.biquad({ f0: 2, type: 'bandpass' })
.plot({ legend: 'bandpass filtered signal' });
mars.runEffects(a, mars.newDefaultScheduler());
mars.runEffects(b, mars.newDefaultScheduler());
mars.runEffects(c, mars.newDefaultScheduler());
```

[Run Example](../examples/basic.html)

### Wavelet Transform of the mouse mouvements

Real-time Continuous Wavelet Transform (CWT) of the mouse movements on
the page.

```javascript
a = mars.mousemove(document)
  .resample(mars.periodic(10))
  .plot()
  .multicast();
w = a.wavelet({ bandsPerOctave: 8, frequencyMin: 0.2, optimisation: 'standard2' }).heatmap();
mars.runEffects(a, mars.newDefaultScheduler());
mars.runEffects(w, mars.newDefaultScheduler());
```

[Run Example](../examples/mousewave.html)

### Myo data plotter (works only locally)

Simple monitoring of the raw myo data obtained through myo.js. This example only works locally, with _Myo Connect_ configured and running.

```javascript
Myo.on('connected', () => {
  const myo = mars.myo();
  const acc = myo.acc.resample(mars.periodic(20)).mvavrg({ size: 5 }).plot({ legend: 'Raw Acceleration'});
  const gyro = myo.gyro.plot({ legend: 'Raw Gyroscopes'});
  const emg = myo.emg.plot({ legend: 'Raw EMGs', stacked: true });
  const scheduler = mars.newDefaultScheduler();
  mars.runEffects(myo, scheduler);
  mars.runEffects(acc, scheduler);
  mars.runEffects(gyro, scheduler);
  mars.runEffects(emg, scheduler);
})
```

[Run Example](../examples/myo-plotter.html)
