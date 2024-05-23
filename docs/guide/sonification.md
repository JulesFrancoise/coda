# Building a simple sonification system

This part will guide you through building a simple system for the sonification of mouse movements.

## Creating a granular synthesizer

We will first use granular synthesis to continuously navigate in an audio file. In Coda, synthesizers are objects that are compatible with the WebAudio API, and they follow similar conventions, such as using a `connect` method to build a graph between synthesizers, effects and the output.

The following snippet allows to create a simple [granular synthesizer](https://en.wikipedia.org/wiki/Granular_synthesis). The synthesizer uses a predefined audio sample called `hendrix.flac` (store on the same server, however absolute urls can be used), and is connected to the master audio output thanks to the `.connect()` method.

```js
const granulator = granular({
  file: 'hendrix',
  gain: 0.2,
}).connect();
```

All parameters of the synthesizer can be modulated by assigning values to the corresponding properties of the synthesizer. It is possible to assign values (e.g. numbers) to parameters, but also streams. In this case, the parameter's value will be updated at each new event on the stream.

```js
granulator.gain = 0.4;
granulator.position = 0.4;
granulator.position = periodic(100).rand();
```

In the following example, we use the horizontal position of the pointer to navigate in the audio file:

<CodeExample>

```js
const granulator = granular({
  file: 'hendrix',
  gain: 0.2,
}).connect();

granulator.position = mousemove(doc)
  .select(0)
  .plot({ legend: 'Mouse X => Position in the audio file '});
```

</CodeExample>

## Modulating multiple parameters

The example from the homepage shows how using streams to drive multiple parameters of the sound synthesis allows for the creation of complex mappings:

<CodeExample>

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
granulator.position = mousePosition.select(0);
granulator.resampling = mousePosition.select(1).scale({ outmin: -2400, outmax: 0 });
```

</CodeExample>
