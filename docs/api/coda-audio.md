# @coda/audio

## bitcrusher

```ts
 bitcrusher(options: Object): Bitcrusher
```

Create a Bitcrusher audio effect.Based on the Tuna Audio effect library: <a
      href="https://github.com/Theodeus/tuna/"
      target="_blank"
    >
      https://github.com/Theodeus/tuna/
    </a>

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|Bitcrusher parameters|
|options.bits|Number|16|Number of bits (decimation)|
|options.normfreq|Number|0.1|Normalized downsampling frequency|
|options.bufferSize|Number|4096|Buffer size|
**Returns** `Bitcrusher` Bitcrusher engine


## catart

```ts
 catart(options: Object): PolyCatartEngine
```

Create a Polyphonic Catart-style descriptor-driven corpus-based concatenative synthesis

::: tip TODO
Code example + Description of markers file structure
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|Concatenative synthesis parameters|
|options.voices|Number|1|Number of voices (polyphony)|
|options.file|String|Array&lt;String&gt;|''|Default audio file. Each audio file must be<br>associated with a JSON file containing the associated markers.|
|options.filePrefix|String|'/media/'|Address where audio files are stored|
|options.fileExt|String|'flac'|Audio files extension|
|options.descriptors|Array&lt;string&gt;|['loudness']|List of descriptors to consider|
|options.target|Array&lt;Number&gt;|[0]|Target descriptors for driving the synthesis|
|options.k|Number|Array&lt;Number&gt;|1|Number of KNN Neighbors (randomized in segment<br>playback)|
|options.periodAbs|Number|Array&lt;Number&gt;|0|Segment period (absolute, in s)|
|options.periodRel|Number|Array&lt;Number&gt;|1|Segment period (relative to segment<br>duration)|
|options.periodVar|Number|Array&lt;Number&gt;|0|Segment period random variation|
|options.durationAbs|Number|Array&lt;Number&gt;|1|Segment duration (absolute, in s)|
|options.durationRel|Number|Array&lt;Number&gt;|1|Segment duration (relative to<br>segment duration)|
|options.index|Number|Array&lt;Number&gt;|0|Segment index|
|options.positionVar|Number|Array&lt;Number&gt;|0|Segment position random variation|
|options.attackAbs|Number|Array&lt;Number&gt;|0.001|Segment attack (absolute)|
|options.attackRel|Number|Array&lt;Number&gt;|0|Segment attack (relative to duration)|
|options.releaseAbs|Number|Array&lt;Number&gt;|0.001|Segment release (absolute)|
|options.releaseRel|Number|Array&lt;Number&gt;|0|Segment release (relative to duration)|
|options.resampling|Number|Array&lt;Number&gt;|0|Segment resampling|
|options.resamplingVar|Number|Array&lt;Number&gt;|0|Segment resampling  random variation|
|options.gain|Number|Array&lt;Number&gt;|0|Segment gain|
|options.repeat|Boolean|true|Allow segment repeat|
|options.throttle|Number|Array&lt;Number&gt;|20|Throttle time for stream parameters|
**Returns** `PolyCatartEngine` Concatenative synthesis engine


## chorus

```ts
 chorus(options: Object): Chorus
```

Create a Chorus effectBased on the Tuna Audio effect library: <a
      href="https://github.com/Theodeus/tuna/"
      target="_blank"
    >
      https://github.com/Theodeus/tuna/
    </a>

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|Effect options|
|options.rate|Number|1.5|Chorus rate (Hz)|
|options.feedback|Number|0.4|Feedback level|
|options.depth|Number|0.7|Feedback level|
|options.delay|Number|0.0045|Delay time (s)|
**Returns** `Chorus` Chorus engine


## compressor

```ts
 compressor(options: Object): Compressor
```

Create a Compressor effectBased on the Tuna Audio effect library: <a
      href="https://github.com/Theodeus/tuna/"
      target="_blank"
    >
      https://github.com/Theodeus/tuna/
    </a>

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|Effect options|
|options.threshold|Number|-1|Threshold (dB)|
|options.makeupGain|Number|1|Makeup Gain|
|options.attack|Number|1|Attack time (ms)|
|options.release|Number|0|Release time (ms)|
|options.ratio|Number|4|Compression Ratio|
|options.knee|Number|5|Knee|
|options.automakeup|Number|true|Automakeup|
**Returns** `Compressor` Compressor engine


## concatenative

```ts
 concatenative(options: Object): ConcatenativeEngine
```

Create a polyphonic concatenative synthesizer

::: tip TODO
Code example + Description of markers file structure
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|Concatenative synthesis parameters|
|options.voices|number|1|NNumber of voices (polyphony)|
|options.file|String|''|Default audio file. Each audio file must be associated with<br>a JSON file containing the associated markers.|
|options.filePrefix|String|'/media/'|Address where audio files are stored|
|options.fileExt|String|'flac'|Audio files extension|
|options.periodAbs|number|0|Segment period (absolute, in s)|
|options.periodRel|number|1|Segment period (relative to segment duration)|
|options.periodVar|number|0|Segment period random variation|
|options.durationAbs|number|1|Segment duration (absolute, in s)|
|options.durationRel|number|1|Segment duration (relative to segment duration)|
|options.index|number|0|Segment index|
|options.positionVar|number|0|Segment position random variation|
|options.attackAbs|number|0.001|Segment attack (absolute)|
|options.attackRel|number|0|Segment attack (relative to duration)|
|options.releaseAbs|number|0.001|Segment release (absolute)|
|options.releaseRel|number|0|Segment release (relative to duration)|
|options.resampling|number|0|Segment resampling|
|options.resamplingVar|number|0|Segment resampling  random variation|
|options.gain|number|1|Segment gain|
|options.repeat|Boolean|true|Allow segment repeat|
|options.throttle|number|20|Throttle time for stream parameters|
**Returns** `ConcatenativeEngine` Concatenative synthesis engine


## convolver

```ts
 convolver(options: Object): Convolver
```

Create a Convolver effect

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|Convolution parameters|
|options.file|String|''|Default audio file|
|options.filePrefix|String|''|Address where audio files are stored|
|options.fileExt|String|''|Audio files extension|
**Returns** `Convolver` Convolution engine


## filt

```ts
 filt(options: Object): AudioFilter
```

Create an Audio Filter effectBased on the Tuna Audio effect library: <a
      href="https://github.com/Theodeus/tuna/"
      target="_blank"
    >
      https://github.com/Theodeus/tuna/
    </a>

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|AudioFilter parameters|
|options.frequency|Number|440|Cutoff Frequency (Hz)|
|options.Q|Number|1|Q factor (resonance)|
|options.gain|Number|0|Filter gain|
|options.filterType|String|'lowpass'|Filter type (lowpass, highpass, bandpass,<br>lowshelf, highshelf, peaking, notch, allpass)|
**Returns** `AudioFilter` AudioFilter engine


## granular

```ts
 granular(options: Object): GranularEngine
```

Create a polyphonic granular synthesizer

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|Granular synthesis parameters|
|options.voices|Number|1|Number of voices (polyphony)|
|options.file|String|''|Default audio file|
|options.filePrefix|String|''|Address where audio files are stored|
|options.fileExt|String|''|Audio files extension|
|options.period|Number|0.01|Grain period|
|options.duration|Number|0.1|Grain duration|
|options.position|Number|0|Grain position|
|options.positionVar|Number|0|Grain position random variation|
|options.attackAbs|Number|0|Grain attack (absolute)|
|options.attackRel|Number|0.5|Grain attack (relative to duration)|
|options.releaseAbs|Number|0|Grain release (absolute)|
|options.releaseRel|Number|0.5|Grain release (relative to duration)|
|options.resampling|Number|0|Grain resampling|
|options.resamplingVar|Number|0|Grain resampling  random variation|
|options.gain|Number|1|Grain gain|
|options.throttle|Number|20|Throttle time for stream parameters|
**Returns** `GranularEngine` Granular synthesis engine


## microphone

```ts
 microphone(options: Object): MicrophoneSource
```

Create an audio source from the microphone

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|Options|
|options.gain|Number|0.5|Gain|
**Returns** `MicrophoneSource` 

**Example**
```js
// Create a source from the microphone
m = microphone();

// Create a chorus effect and connect the microphone input
c = chorus({ rate: 0.9 }).connect();
m.connect(c);

// Modulate chorus parameters
c.feedback = 0.97;
c.delay = 0.45;
c.rate = 10;
```


## moogFilter

```ts
 moogFilter(options: Object): MoogFilter
```

Create a MoogFilter effectBased on the Tuna Audio effect library: <a
      href="https://github.com/Theodeus/tuna/"
      target="_blank"
    >
      https://github.com/Theodeus/tuna/
    </a>

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|MoogFilter parameters|
|options.cutoff|Number|0.065|Cutoff frequency (Hz)|
|options.resonance|Number|3.5|Filter resonance|
|options.bufferSize|Number|4096|Buffer size|
**Returns** `MoogFilter` MoogFilter engine


## overdrive

```ts
 overdrive(options: Object): Overdrive
```

Create a Overdrive effectBased on the Tuna Audio effect library: <a
      href="https://github.com/Theodeus/tuna/"
      target="_blank"
    >
      https://github.com/Theodeus/tuna/
    </a>

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|Effect options|
|options.outputGain|Number|-3|Output Gain (dB)|
|options.drive|Number|1|Drive|
|options.amount|Number|0|Amount|
|options.algorithmIndex|Number|0|Type of Overdrive Algorithm (0-5)|
**Returns** `Overdrive` Overdrive engine


## panner

```ts
 panner(options: Object): Panner
```

Create a Panner effectBased on the Tuna Audio effect library: <a
      href="https://github.com/Theodeus/tuna/"
      target="_blank"
    >
      https://github.com/Theodeus/tuna/
    </a>

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|Effect options|
|options.pan|Number|0|Pan position (-1 < 1)|
**Returns** `Panner` Panner engine


## phaser

```ts
 phaser(options: Object): Phaser
```

Create a Phaser effectBased on the Tuna Audio effect library: <a
      href="https://github.com/Theodeus/tuna/"
      target="_blank"
    >
      https://github.com/Theodeus/tuna/
    </a>

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|Effect options|
|options.rate|Number|1.2|Rate|
|options.depth|Number|0.3|Depth|
|options.feedback|Number|0.2|Feedback|
|options.stereoPhase|Number|30|Stereo Phase (deg)|
|options.baseModulationFrequency|Number|700|Base Modulation Frequency|
**Returns** `Phaser` Phaser engine


## pingpong

```ts
 pingpong(options: Object): PingPongDelay
```

Create a PingPongDelay effectBased on the Tuna Audio effect library: <a
      href="https://github.com/Theodeus/tuna/"
      target="_blank"
    >
      https://github.com/Theodeus/tuna/
    </a>

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|Effect options|
|options.level|Number|0.5|Level|
|options.feedback|Number|0.3|Feedback|
|options.timeLeft|Number|150|Left delay time (ms)|
|options.timeRight|Number|200|Left delay time (ms)|
**Returns** `PingPongDelay` PingPongDelay engine


## sampler

```ts
 sampler(options: Object): SamplerEngine
```

Create a polyphonic concatenative synthesizer

::: tip TODO
Code example + Description of markers file structure
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|Sampler synthesis parameters|
|options.file|String|''|Default audio file. Each audio file must be associated with<br>a JSON file containing the associated markers.|
|options.filePrefix|String|'/media/'|Address where audio files are stored|
|options.fileExt|String|'flac'|Audio files extension|
|options.fadeTime|number|600|Fade time for chaining segments|
|options.cyclic|number|false|Loop mode|
|options.gain|number|1|Segment gain|
|options.throttle|number|20|Throttle time for stream parameters|
**Returns** `SamplerEngine` Sampler synthesis engine


## tremolo

```ts
 tremolo(options: Object): Tremolo
```

Create a Tremolo effectBased on the Tuna Audio effect library: <a
      href="https://github.com/Theodeus/tuna/"
      target="_blank"
    >
      https://github.com/Theodeus/tuna/
    </a>

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|Effect options|
|options.intensity|Number|0.3|intensity|
|options.rate|Number|4|Rate|
|options.stereoPhase|Number|0|Stereo Phase (deg)|
**Returns** `Tremolo` Tremolo engine


