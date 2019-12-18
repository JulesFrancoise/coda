# @coda/max

## fromMax

```ts
 fromMax(options: Object): Stream
```

Receive data from Max

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|Options|
|options.host|string|'localhost'|Hostname (ws server)|
|options.port|number|8080|Port (ws server)|
|options.channel|string|'data'|Channel name|
**Returns** `Stream` Unchanged stream


## toMax

```ts
 toMax(options: Object, source: Stream): Stream
```

Send data to Max

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|Options|
|options.hostname|String|'localhost'|Hostname (ws server)|
|options.channel|String|'data'|Channel name|
|source|Stream||Source stream|
**Returns** `Stream` Unchanged stream


