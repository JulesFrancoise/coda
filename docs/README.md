---
home: true
heroImage: /coda-logo.png
heroText: '---'
tagline: coda.js is a javascript library and live-coding environment dedicated to the design of bodily interactions with audio and visual processing.
actionText: Get Started →
actionLink: /guide/
features:
- title: Sense
  details: coda.js integrates bindings to some common sensing devices (such as the Myo armband) and bridges with other platforms (for example, Max).
- title: Analyze
  details: coda.js comes with a collection of low-level signal processing operators, and a number of movement analysis, recognition, and interaction design tools.
- title: Generate
  details: coda.js integrates sound synthesis engines and digital audioi effects to facilitate conntinuous movement sonification.
footer: XXX Licensed | Copyright © 2018-present Jules Françoise
---

## Example

In this example, we map the position and velocity of the mouse to control sound textures of a thunderstorm.

::: warning
Audio might be loud!
:::

```js
const mousePosition = mousemove(doc)
  .startWith([0.5, 0.5])   // initialize position to [0.5; 0.5]
  .resample(periodic(10))  // resample at 100Hz
  .mvavrg({ size: 7 })     // apply a moving-average filter
  .plot({ legend: 'Mouse position (100Hz)'});

const mouseVelocity = mousePosition
  .delta({ size: 9 })      // compute the first derivative
  .plot({ legend: 'Mouse velocity (100Hz)'});

const mouseEnergy = mouseVelocity
  .map(x => Math.sqrt((x[0] * x[0] + x[1] * x[1]) / 2))     // norm of the velocity
  .withAttr({ format: 'scalar', size: 1 }) // adapt stream attributes
  .plot({ legend: 'mouse energy' });

const granulator = granular({
  file: 'thunderstorm',
  period: 0.2,
  duration: 2,
  releaseRel: 0.5,
});
granulator.connect();

granulator.gain = mouseEnergy;
granulator.position = mousePosition.unpack()[0];
granulator.resampling = mousePosition.unpack()[1]
  .scale({ outmin: -2400, outmax: 2400 });
```