# @coda/ui

## heatmap

```ts
 heatmap(options: object, source: Stream): Stream
```

Simple Heatmap UI component. The heatmap works like a sonogram<br>visualization (sliding window).

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|object||Heatmap options|
|options.duration|number|5|Duration of the window|
|options.refresh|number|50|Refresh rate (ms)|
|options.legend|string|''|Plot legend|
|source|Stream||Input stream (scalar or vector)|
**Returns** `Stream` Scalogram stream

**Example**


<CodeExample name="heatmap">

```js
noise = periodic(20).rand({ size: 20 }).heatmap();
```

</CodeExample>


## looper

```ts
 looper(options: object, source: Stream): Stream
```

Data Looper UI component. This module allows to record a buffer of Stream<br>data that can be looped.

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|object||Looper UI options|
|options.refresh|number|50|Refresh rate (ms)|
|options.stacked|boolean|false|Specifies if curves should be<br>stacked (by default, curves are superposed)|
|options.fill|string|'none'|Plain fill options:<br>- 'none': no plain filling (defaut)<br>- 'bottom': fill from bottom<br>- 'middle': fill from middle<br>- 'top': fill to top<br>|
|source|Stream||Input Stream (scalar or vector)|
**Returns** `Stream` Output Stream: either unchanged input stream (in<br>'thru' or 'recording' modes), or loop of the recorded buffer (in playing<br>mode)

**Example**


<CodeExample name="looper">

```js
data = periodic(10).rand().mvavrg({ size: 30 }).plot();
l = data.looper().plot();
```

</CodeExample>


## nodes

```ts
 nodes(options: object, source: Stream): Stream
```

Nodes UI component with nodes interface. Multibuffer. Records to a global buffer.

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|object||Nodes options|
|options.name|string|''|Buffer name|
|options.refresh|number|50|Refresh rate (ms)|
|options.stacked|boolean|false|Specifies if curves should be<br>stacked (by default, curves are superposed)|
|options.fill|string|'none'|Plain fill options:<br>- 'none': no plain filling (defaut)<br>- 'bottom': fill from bottom<br>- 'middle': fill from middle<br>- 'top': fill to top<br>|
|source|Stream||Input Stream (scalar or vector)|
**Returns** `Stream` Unchanged Input Stream


## plot

```ts
 plot(options: object, source: Stream): Stream
```

Simple Plotter UI component.

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|object||Plot options|
|options.duration|number|5|Duration of the window|
|options.refresh|number|50|Refresh rate (ms)|
|options.legend|string|''|Plot legend|
|options.stacked|boolean|false|Specifies if curves should be<br>stacked (by default, curves are superposed)|
|options.fill|string|'none'|Plain fill options:<br>- 'none': no plain filling (defaut)<br>- 'bottom': fill from bottom<br>- 'middle': fill from middle<br>- 'top': fill to top<br>|
|source|Stream||Input Stream (scalar or vector)|
**Returns** `Stream` Unchanged Input Stream

**Example**


<CodeExample name="plot">

```js
p = periodic(20).rand({ size: 3 })
  .plot({ legend: 'Simple plot', stacked: true });
runEffects(p, newDefaultScheduler());
```

</CodeExample>


## recorder

```ts
 recorder(options: object, source: Stream): Stream
```

Recorder UI component. Multibuffer. Records to a global buffer.

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|object||Recorder options|
|options.name|string|''|Buffer name|
|options.refresh|number|50|Refresh rate (ms)|
|options.stacked|boolean|false|Specifies if curves should be<br>stacked (by default, curves are superposed)|
|options.fill|string|'none'|Plain fill options:<br>- 'none': no plain filling (defaut)<br>- 'bottom': fill from bottom<br>- 'middle': fill from middle<br>- 'top': fill to top<br>|
|source|Stream||Input Stream (scalar or vector)|
**Returns** `Stream` Unchanged Input Stream


