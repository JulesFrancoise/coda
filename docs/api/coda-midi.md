# @coda/midi

## atodb

```ts
 atodb(source: Stream): Stream
```

The `atob` operator converts a stream of scalar or vector values from<br>amplitude to deciBels.

|Parameter|Type|Default|Description|
|---|---|---|---|
|source|Stream||Input stream (amplitude values)|
**Returns** `Stream` Scaled stream (dB values)

**Example**


<CodeExample name="atodb">

```js
db = now([0, 0.5, 1])
  .tap(x => console.log(`Amplitude: [${x}]`))
  .atodb()
  .tap(x => console.log(`deciBels: [${x}]`));
```

</CodeExample>


## dbtoa

```ts
 dbtoa(source: Stream): Stream
```

The `dbtoa` operator converts a stream of scalar or vector values from<br>deciBels to amplitude.

|Parameter|Type|Default|Description|
|---|---|---|---|
|source|Stream||Input stream (dB values)|
**Returns** `Stream` Scaled stream (amplitude values)

**Example**


<CodeExample name="dbtoa">

```js
a = now([0, -6, -Infinity])
  .tap(x => console.log(`deciBels: [${x}]`))
  .dbtoa()
  .tap(x => console.log(`Amplitude: [${x}]`));
```

</CodeExample>


## ftom

```ts
 ftom(source: Stream): Stream
```

The `ftom` operator converts a stream of scalar or vector values from frequency<br>to scale.

|Parameter|Type|Default|Description|
|---|---|---|---|
|source|Stream||Input stream (frequency values)|
**Returns** `Stream` Scaled stream (midi values)


## mtof

```ts
 mtof(source: Stream): Stream
```

The `mtof` operator converts a stream of scalar or vector values from midi<br>to frequency scale.

|Parameter|Type|Default|Description|
|---|---|---|---|
|source|Stream||Input stream (midi values)|
**Returns** `Stream` Scaled stream (frequency values)


## quantize

```ts
 quantize(options: Object, source: Stream): Stream
```

Quantize a scalar or vector stream to a given scale (chromatic by default).

::: tip see
https://github.com/danigb/tonal
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|WHAT ?????? ""|
|options.scale|Number|'chromatic'|Musical Scale (ex: 'C major')Available scales: aeolian, altered, augmented, augmented heptatonic,<br>balinese, bebop, bebop dominant, bebop locrian, bebop major, bebop minor,<br>chromatic, composite blues, diminished, dorian, dorian #4, double harmonic<br>lydian, double harmonic major, egyptian, enigmatic, flamenco, flat six<br>pentatonic, flat three pentatonic, harmonic major, harmonic minor,<br>hirajoshi, hungarian major, hungarian minor, ichikosucho, in-sen, ionian<br>augmented, ionian pentatonic, iwato, kafi raga, kumoijoshi, leading whole<br>tone, locrian, locrian #2, locrian major, locrian pentatonic, lydian,<br>lydian #5P pentatonic, lydian #9, lydian augmented, lydian diminished, lydian<br>dominant, lydian dominant pentatonic, lydian minor, lydian pentatonic,<br>major, major blues, major flat two pentatonic, major pentatonic, malkos<br>raga, melodic minor, melodic minor fifth mode, melodic minor second mode,<br>minor #7M pentatonic, minor bebop, minor blues, minor hexatonic, minor<br>pentatonic, minor six diminished, minor six pentatonic, mixolydian,<br>mixolydian pentatonic, mystery #1, neopolitan, neopolitan major, neopolitan<br>major pentatonic, neopolitan minor, oriental, pelog, persian, phrygian,<br>piongio, prometheus, prometheus neopolitan, purvi raga, ritusen, romanian<br>minor, scriabin, six tone symmetric, spanish, spanish heptatonic, super<br>locrian pentatonic, todi raga, vietnamese 1, vietnamese 2, whole tone, whole<br>tone pentatonic|
|options.mode|Number|'round'|Quantization mode: 'round' selects<br>the closest note, 'floor' the closest lower note, 'ceil' the closest higher<br>note.|
|options.octavemin|Number|0|Minimum octave|
|options.octavemax|Number|10|Maximum octave|
|source|Stream||Input stream (~midi notes)|
**Returns** `Stream` Quantized stream


