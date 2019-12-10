# Misc

## BaseAudioEffect

```ts
 BaseAudioEffect()0
```

Base architecture for Audio Effects engines accepting stream parameters

|Parameter|Type|Default|Description|
|---|---|---|---|

## BaseAudioEngine

```ts
 BaseAudioEngine()0
```

Base architecture for Audio engines accepting stream parameters

|Parameter|Type|Default|Description|
|---|---|---|---|

## Bitcrusher

```ts
 Bitcrusher(options: Object)0
```

Bitcrusher audio effect

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object||Effect options|
|options.bits|Number|16|Number of bits (decimation)|
|options.normfreq|Number|0.1|Normalized downsampling frequency|
|options.bufferSize|Number|4096|Buffer size|

## MicrophoneSource

```ts
 MicrophoneSource(options: Object)0
```

Microphone Source Node

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object||Options|

## kick

```ts
 kick(options: Object, source: Stream): Stream
```

Simple multidimensional kick detection.

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|Kick detection Options|
|options.feedback|Number|0.9|intensity feedback|
|options.gain|Number|0.2|intensity gain|
|options.up|Number|40|Upper Threshold for kick detection|
|options.down|Number|30|Release threshold|
|source|Stream||Source Stream (scalar or vector)|
**Returns** `Stream` Binary Kick detection stream


