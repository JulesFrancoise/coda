# @coda/core

## accum

```ts
 accum(source: Stream): Stream
```

Accumulate the values of a scalar or vector stream

|Parameter|Type|Default|Description|
|---|---|---|---|
|source|Stream||Input stream (scalar or vectorial)|
**Returns** `Stream` Stream of accumulated values

**Example**
```js
// generate a constant unit signal sampled at 1Hz, and accumulate
// the results (sliced at 10 iterations)
const process = periodic(500)
  .constant(1)
  .accum()
  .take(10)
  .tap(log);
```


## adaptive

```ts
 adaptive(options: Object, source: Stream): Stream
```

Automatically scale an incoming stream of scalar or vector values over the X previous<br>seconds to the [0; 1] range.

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|Adaptive scaling Options|
|options.duration|Scalar|15|Duration (s) of the sliding window on which to<br>compute the min/max bounds|
|options.refresh|Scalar|1|Refresh duration (s) to compute min/max|
|source|Stream||Input stream|
**Returns** `Stream` Scaled stream

**Example**
```js
// Generate a random signal and apply adaptive scaling
a = periodic(10)
  .rand({size : 2})
  .biquad({ f0: 1 })
  .plot()
  .adaptive({ duration: 10, refresh: 2 })
  .plot();
```


## add

```ts
 add(first: Stream, second: Stream): Stream
```

Adds the values from two streams. Triggers only on events from the first<br>stream.

::: tip TODO
add$ for a version that triggers from all streams.
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|first|Stream||The main source stream|
|second|Stream||The secondary stream to combine|
**Returns** `Stream` Output stream of summed values

**Example**
```js
const c = add(now(3), now(2)).tap(console.log);
// This is equivalent to:
// const c = now(3).add(now(2)).tap(console.log);
```


## adsr

```ts
 adsr(options: Object, source: Stream): Stream
```

Generate ADSR data stream envelopes (not audio envelopes) from a binary stream.

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|Envelope options|
|options.attack|Object|500|Attack time|
|options.decay|Object|200|Decay time|
|options.sustain|Object|8|Sustain level|
|options.release|Object|1000|Release time|
|options.period|Object|10|Sampling period|
|source|Stream||Source binary Stream|
**Returns** `Stream` Envelope values


## autoscale

```ts
 autoscale(source: Stream): Stream
```

Automatically scale an incoming stream of scalar or vector values to the<br>[0; 1] range.

|Parameter|Type|Default|Description|
|---|---|---|---|
|source|Stream||Input stream|
**Returns** `Stream` Scaled stream

**Example**
```js
const source = periodic(200).rand().scale({ outmin: -30, outmax: 200 });
const scaled = source.autoscale().tap(console.log);
```


## biquad

```ts
 biquad(options: Object, source: Stream): Stream
```

Biquad Filter, based on Ircam's Waves-LFO Module.

::: tip see
https://github.com/wavesjs/waves-lfo
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object||Filter options|
|options.type|String|'lowpass'|Type of filter. Available options:<br>- 'lowpass', 'highpass', 'bandpass_constant_skirt', 'bandpass',<br>- 'bandpass_constant_peak', 'notch', 'allpass', 'peaking', 'lowshelf',<br>'highshelf'.<br>|
|options.f0|Number|1|Filter cutoff frequency (Hz)|
|options.gain|Number|1|Filter gain|
|options.q|Number|1|Filter resonance|
|source|Stream||Input stream (scalar or vectorial)|
**Returns** `Stream` Stream of filtered values

**Example**
```js
const noise = periodic(20).rand().plot({ legend: 'Random Signal' });
const filtered = noise.biquad({ f0: 0.8 }).plot({ legend: 'Filtered Signal' });
```


## clip

```ts
 clip(options: Object, source: Stream): Stream
```

Clip an incoming stream of scalar or vector to a given range.

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|Scaling options|
|options.min|Number|0|Minimum of the range|
|options.max|Number|1|Maximum of the range|
|source|Stream||Input stream|
**Returns** `Stream` Clipped stream

**Example**
```js
s = periodic(20).rand().biquad({ f0: 1, q: 5 }).plot({ legend: 'original signal' });
c = s.clip({ min: 0.3, max: 0.8 }).plot({ legend: 'original signal' });
```


## cycle

```ts
 cycle(buffer: Array|String, source: Stream): Stream
```

Cycle through a set of symbols. Each event on the input stream will result<br>in an output event sampled from the buffer passed in argument. The buffer<br>can either contain an array or a string.

|Parameter|Type|Default|Description|
|---|---|---|---|
|buffer|Array|String||Buffer content to cycle through. The buffer<br>should be an Array or a string. If a string is passed as buffer, the cycle<br>iterates over the characters of the string. If an array is passed, the cycle<br>periodically iterates over the values of the array.|
|source|Stream||Input stream (trigger)|
**Returns** `Stream` Output Stream, sampled from the buffer, with<br>corresponding attributes (e.g. using an array of numbers as a buffer<br>will result in a stream with attributes `{ format: 'scalar', size: 1 }`).

**Example**
```js
a = periodic(250)
  .cycle(['A2', 'C3', 'A5', 'D1'])
  .take(8)
  .tap(log);
```


## delta

```ts
 delta(options: Object, source: Stream): Stream
```

The `delta` operator computes a differentiation of an incoming stream of<br>scalar or vector values over a fixed size window. It uses linear regression<br>to estimate the slope of the signal over the given window.

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|Delta options|
|options.size|Number|3|Window size (should be odd, minimum: 3)|
|source|Stream||Input stream|
**Returns** `Stream` Scaled stream

**Example**
```js
// Compute mouse velocity/acceleration from a resampled version of the mouse position
a = mousemove(doc)
  .resample(periodic(10))
  .mvavrg({ size: 5 })
  .plot({ legend: 'Mouse Position'})
  .delta({ size: 5 })
  .plot({ legend: 'Mouse velocity' })
  .delta({ size: 5 })
  .plot({ legend: 'Mouse acceleration' });
```


## distance

```ts
 distance(first: Stream, second: Stream): Stream
```

Compute the euclidean distance between two points

|Parameter|Type|Default|Description|
|---|---|---|---|
|first|Stream||Vector stream of the first point|
|second|Stream||Vector stream of the second point|
**Returns** `Stream` The eucliden distance between the two streams


## div

```ts
 div(first: Stream, second: Stream): Stream
```

Divides the values of a stream by the values of another stream. Triggers<br>only on events from the first stream.

::: tip TODO
div$ for a version that triggers from all streams.
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|first|Stream||The main source stream|
|second|Stream||The secondary stream to combine|
**Returns** `Stream` Output stream of divided values

**Example**
```js
const c = div(now(9), now(2)).tap(console.log);
// This is equivalent to:
// const c = now(9).div(now(2)).tap(console.log);
```


## elementwise

```ts
 elementwise(f: Function, first: Stream, second: Stream): Stream
```

Applies an element-wise operator to the values of two stream. Triggers<br>only on events from the main stream.

::: tip TODO
elementwise for a version that triggers from all streams.
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|f|Function||Binary combinator function (applies to scalars)|
|first|Stream||The main source stream|
|second|Stream||The secondary stream to combine|
**Returns** `Stream` Output stream of combined values

**Example**
```js
const norm = (x, y) => Math.sqrt(x * x + y * y);
const c = elementwise(norm, now([4, 2]), now([3, 1])).tap(console.log);
```


## force

```ts
 force(options: Object, source: Stream): Stream
```

Estimate the force (muscular contraction) from EMG data, using bayesian filtering techniques.

::: tip see
Sanger, Terence D. "Bayesian filtering of myoelectric signals." Journal of
neurophysiology 97.2 (2007): 1839-1845.
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object||Filter Options|
|options.logdiff|number|-2|Logarithm of the diffusion rate|
|options.logjump|number|-30|Logarithm of the jump probability|
|source|Stream||Input stream of EMG data (scalar or vector)|
**Returns** `Stream` Stream of force from the EMG

**Example**
```js
fake = periodic(5)
  .rand()
  .scale({ outmin: -1 })
  .mul(periodic(10).rand().biquad({ f0: 0.5, q: 12 }))
  .plot();
f = fake.withAttr({ type: 'emg' }).force().plot();
```


## intensity

```ts
 intensity(options: Object, source: Stream): Stream
```

Compute the intensity of the motion from accelerometer signals

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|Intensity calculation options|
|options.feedback|String|0.9|Feedback rate (higher feedback = slower decay)|
|options.gain|String|0.2|gain|
|source|Stream||Input stream (scalar or vectorial)|
**Returns** `Stream` Stream of intensity values (scalar)

**Example**
```js
fakeAcc = periodic(10)
  .rand({ size: 3 })
  .biquad({ f0: 5 })
  .plot({ legend: 'accelerometer signal'});
intensity = fakeAcc.intensity().plot({ legend: 'Intensity' });
```


## kicks

```ts
 kicks(options: Object, source: Stream): Stream
```

Simple multidimensional kick detection using the continuous wavelet<br>transform.We use a wavelet transform to measure the signal's<br>energy in a high frequency range (> 10 Hz). The derivation of the total<br>energy allows us to track rapid changes. Onsets are finally detected using a<br>Schmitt trigger.

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|Kick detection Options|
|options.fmin|Object|{10}|Minimum frequency for the Wavelet<br>Transform|
|options.threshold|Object|{40}|Upper Threshold for kick detection|
|options.thresholdRelease|Object|{30}|Release threshold|
|source|Stream||Source Stream (scalar or vector)|
**Returns** `Stream` Binary Kick detection stream


## line

```ts
 line(options: Object): Stream
```

Generate a data ramp of fixed duration. The line is a single Stream<br>that terminates at the end of the ramp.

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|Line options|
|options.start|Number|0|Start value|
|options.end|Number|1|End value|
|options.duration|Number|1000|Duration in ms|
|options.period|Number|10|Sampling period in ms|
**Returns** `Stream` Finite stream


## lineto

```ts
 lineto(options: Object, source: Stream): Stream
```

Generate an infinite data stream of various ramps triggered from an input stream.<br>The input stream can be scalar, in this case each event specifies the target value<br>and the line duration is fixed, or it can be a vector stream with two values,<br>the target value and the ramp duration.

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|Line options|
|options.duration|Number|1000|Duration in ms|
|options.period|Number|10|Sampling period in ms|
|source|Stream||Source stream|
**Returns** `Stream` Finite stream


## max

```ts
 max(source: Stream): Stream
```

Compute the maximum of each frame of a vector stream

|Parameter|Type|Default|Description|
|---|---|---|---|
|source|Stream||Source vector stream|
**Returns** `Stream` Scalar stream (frame maximum)

**Example**
```js
s = now([1, 2, 3, -4]).max().tap(console.log);
```


## mean

```ts
 mean(source: Stream): Stream
```

Compute the mean of the values of a vector stream

|Parameter|Type|Default|Description|
|---|---|---|---|
|source|Stream||Source vector stream|
**Returns** `Stream` Scalar stream (mean of the vector values)

**Example**
```js
m = now([1, 2, 3]).mean().tap(console.log);
```


## meanstd

```ts
 meanstd(source: Stream): Stream
```

Compute the mean and standard deviation of the values of a vector stream

|Parameter|Type|Default|Description|
|---|---|---|---|
|source|Stream||Source vector stream|
**Returns** `Stream` Scalar stream ([mean, std] of the vector values)

**Example**
```js
m = now([1, 2, 3, 4, 5]).meanstd().tap(console.log);
```


## min

```ts
 min(source: Stream): Stream
```

Compute the minimum of each frame of a vector stream

|Parameter|Type|Default|Description|
|---|---|---|---|
|source|Stream||Source vector stream|
**Returns** `Stream` Scalar stream (frame minimum)

**Example**
```js
s = now([1, 2, 3, -4]).min().tap(console.log);
```


## minmax

```ts
 minmax(source: Stream): Stream
```

Compute the minimum and maximum of each frame of a vector stream

|Parameter|Type|Default|Description|
|---|---|---|---|
|source|Stream||Source vector stream|
**Returns** `Stream` Scalar stream ([min, max])

**Example**
```js
s = now([1, 2, 3, -4]).minmax().tap(console.log);
```


## mul

```ts
 mul(first: Stream, second: Stream): Stream
```

Multiply the values from two streams. Triggers only on events from the first<br>stream.

::: tip TODO
mul$ for a version that triggers from all streams.
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|first|Stream||The main source stream|
|second|Stream||The secondary stream to combine|
**Returns** `Stream` Output stream of multiplied values

**Example**
```js
const c = mul(now(7), now(3)).tap(console.log);
// This is equivalent to:
// const c = now(7).mul(now(3)).tap(console.log);
```


## mvavrg

```ts
 mvavrg(options: Object, source: Stream): Stream
```

Compute a moving average on a scalar or vector stream

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object||Moving Average Filter options|
|options.size|String|1|Size in frames of the moving<br>average filter.|
|source|Stream||Input stream (scalar or vectorial)|
**Returns** `Stream` Stream of filtered values

**Example**
```js
noise = periodic(10).rand().plot();
filtered = noise.mvavrg({ size: 20 }).plot();
```


## norm

```ts
 norm(source: Stream): Stream
```

Compute the norm of a vector

|Parameter|Type|Default|Description|
|---|---|---|---|
|source|Stream||Source vector stream|
**Returns** `Stream` Scalar stream (norm)

**Example**
```js
s = now([1, 2, 3]).norm().tap(console.log);
```


## pack

```ts
 pack(sources: Array<Stream>): Stream
```

Pack a vector of scalar streams to a stream of vectors.

|Parameter|Type|Default|Description|
|---|---|---|---|
|sources|Array&lt;Stream&gt;||Input streams (scalar)|
**Returns** `Stream` Stream of concatenated values

**Example**
```js
a = periodic(100).constant(2);
b = periodic(100).rand();
c = pack([a, b]).plot();
```


## pak

```ts
 pak(sources: Array<Stream>): Stream
```

Pack a vector of scalar streams to a stream of vectors. This operator is similar to `pack`<br>except that it triggers an event when an event occurs on any of the incoming streams.

|Parameter|Type|Default|Description|
|---|---|---|---|
|sources|Array&lt;Stream&gt;||Input streams (scalar)|
**Returns** `Stream` Stream of concatenated values

**Example**
```js
a = periodic(200).rand();
b = periodic(10).rand();
c = pak([a, b]).plot();
```


## prod

```ts
 prod(source: Stream): Stream
```

Multiply the elements of each frame of a vector stream

|Parameter|Type|Default|Description|
|---|---|---|---|
|source|Stream||Source vector stream|
**Returns** `Stream` Scalar stream (product of the vector values)

**Example**
```js
s = now([1, 2, 3]).prod().tap(console.log);
```


## rand

```ts
 rand(options: Object, source: Stream): Stream
```

The rand operator generates a stream of scalars or vectors with random<br>values uniformally distributed over [0; 1].

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|Scaling options|
|options.size|Number|1|Dimension of the output stream|
|source|Stream||Input stream|
**Returns** `Stream` Scaled stream

**Example**
```js
randValues = periodic(500).rand().tap(console.log);
noise = periodic(10).rand({ size: 3 }).plot();
```


## reduce

```ts
 reduce(reducer: Function, initial: *, source: Stream): Stream
```

Apply a reducer to each frame of a vector stream

|Parameter|Type|Default|Description|
|---|---|---|---|
|reducer|Function||Reducer function|
|initial|*||initial value|
|source|Stream||Source vector stream|
**Returns** `Stream` Scalar stream

**Example**
```js
r = now([1, 2, 3])
  .reduce((s, x) => s + x, 0)
  .tap(console.log);
```


## scale

```ts
 scale(options: Object, source: Stream): Stream
```

The `scale` operator scales an incoming stream of scalar or vector values<br>given input and output min/max bounds.

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|Scaling options|
|options.inmin|Number|0|Minimum of the range of the input|
|options.inmax|Number|1|Maximum of the range of the input|
|options.outmin|Number|0|Minimum of the range of the output|
|options.outmax|Number|1|Maximum of the range of the output|
|source|Stream||Input stream|
**Returns** `Stream` Scaled stream

**Example**
```js
a = periodic(50).rand();
b = a.scale({ outmin: -1, outmax: 3 });
c = pack([a, b]).plot();
```


## schmitt

```ts
 schmitt(options: object, source: Stream): Stream
```

A Schmitt Trigger binarizes a data stream using two thresholds (up and down)<br>with hysteresis. It triggers 1 if the value exceeds the `up` threshold, and<br>0 if the values becomes lower to the `down` threshold.

::: tip see
https://en.wikipedia.org/wiki/Schmitt_trigger
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|object|{}|Schmitt trigger options|
|options.up|number|0.9|Ascending threshold|
|options.down|number|0.1|Descending threshold|
|options.continuous|boolean|false|Continuous output mode|
|source|Stream||Input Stream (scalar or vector)|
**Returns** `Stream` Binary Stream (scalar or<br>vector). By default, the output stream contains events only on triggers. If<br>`options.continuous = true`, then the output stream contains as many events<br>as the input stream.

**Example**
```js
a = periodic(10)
  .rand()
  .biquad({ f0: 5 })
  .plot({ legend: 'Raw Signal'})
  .schmitt({ up: 0.6, down: 0.4, continuous: true })
  .plot({ legend: 'Schmitt Trigger', fill: 'bottom' });
```


## select

```ts
 select(indices: Number|Array, source: Stream): Stream
```

Select the channels of a numeric stream from a set of indices

|Parameter|Type|Default|Description|
|---|---|---|---|
|indices|Number|Array||The index or array of indices|
|source|Stream||The input stream (scalar or vector)|
**Returns** `Stream` The stream of vectors with values at the selected indices

**Example**
```js
a = periodic(100).rand({ size: 5 }).plot({ stacked: true });
b = a.select([0, 0, 2]).plot({ stacked: true });
c = a.select(1).plot();
```


## slide

```ts
 slide(options: Object, source: Stream): Stream
```

Compute a sliding window on a scalar or vector stream

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object||Sliding Window options|
|options.size|Number|1|Sliding Window size in frames|
|options.hop|Number|1|Hop size in frames|
|source|Stream||Input stream (scalar or vectorial)|
**Returns** `Stream` Stream of sliding windows

**Example**
```js
noise = periodic(100).rand().take(10);
w = noise.slide({ size: 4 }).tap(log)
```


## std

```ts
 std(source: Stream): Stream
```

Compute the standard deviation of the values of a vector stream

|Parameter|Type|Default|Description|
|---|---|---|---|
|source|Stream||Source vector stream|
**Returns** `Stream` Scalar stream (std of the vector values)

**Example**
```js
m = now([1, 2, 3]).std().tap(console.log);
```


## sub

```ts
 sub(first: Stream, second: Stream): Stream
```

Subtract the values from two streams. Triggers only on events from the first<br>stream.

::: tip TODO
sub$ for a version that triggers from all streams.
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|first|Stream||The main source stream|
|second|Stream||The secondary stream to combine|
**Returns** `Stream` Output stream of subtracted values

**Example**
```js
const c = sub(now(7), now(3)).tap(console.log);
// This is equivalent to:
// const c = now(7).sub(now(3)).tap(console.log);
```


## sum

```ts
 sum(source: Stream): Stream
```

Sum the elements of each frame of a vector stream

|Parameter|Type|Default|Description|
|---|---|---|---|
|source|Stream||Source vector stream|
**Returns** `Stream` Scalar stream (sum of the vector values)

**Example**
```js
s = now([1, 2, 3]).sum().tap(console.log);
```


## unpack

```ts
 unpack(source: Stream): Array
```

Unpack a stream of vectors to a vector of scalar streams.

|Parameter|Type|Default|Description|
|---|---|---|---|
|source|Stream||Input stream (vectorial)|
**Returns** `Array` Array of scalar streams

**Example**
```js
s = periodic(20).rand({ size: 2 }).plot({ legend: 'Original Signal'});
[s1, s2] = s.unpack();
a1 = s1.plot({ legend: 'First channel' });
a2 = s2.plot({ legend: 'Second channel' });
```


## wavelet

```ts
 wavelet(options: Object, source: Stream): Stream
```

Online Continuous Wavelet Transform (CWT). This module computes a causal<br>estimate of the CWT with a minimal delay per frequency band. It uses the<br>Morlet Wavelet Basis.

::: tip TODO
Complement description
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|Wavelet Transform Options|
|options.frequencyMin|Object|1|Minimum frequency (Hz)|
|options.frequencyMax|Object|50|Maximum frequency (Hz)|
|options.bandsPerOctave|Object|4|Number of bands per octave|
|options.omega0|Number|5|Carrier Frequency|
|options.optimisation|Object|'none'|Optimisation level. Options<br>include:<br>- `none`: no optimisation<br>- `standard1`: Standard optimisation (level 1)<br>- `standard2`: Standard optimisation (level 2)<br>- `aggressive1`: Aggressive optimisation (level 1)<br>- `aggressive2`: Aggressive optimisation (level 2)<br>|
|source|Stream||Scalar or Vector Stream|
**Returns** `Stream` Stream of Scalogram frames

**Example**
```js
m = mousemove(doc).resample(periodic(10)).plot({ legend: 'mouse position' });
w = m.wavelet().heatmap({ legend: 'Wavelet Transform of the mouse position' });
```


## withAttr

```ts
 withAttr(attr: Object): Function
```

Attach attributes to an existing stream

|Parameter|Type|Default|Description|
|---|---|---|---|
|attr|Object||Attributes|
**Returns** `Function` function


