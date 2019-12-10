# @coda/sensors

## devicemotion

```ts
 devicemotion(): Object
```

Create streams from the DeviceMotion API. Three streams are created:
- `acc`: acceleration without gravity
- `accG`: acceleration including gravity
- `gyro`: gyroscopes (rotation rates)


::: warning
This operator does not work on all devices (especially, on desktop computers).
:::

::: tip see
https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent
:::

::: tip TODO
check why some descriptors do not run sometimes (multiple streams)
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
**Returns** `Object` Devicemotion data structure, including the following streams:
- `acc`: acceleration without gravity
- `accG`: acceleration including gravity
- `gyro`: gyroscopes (rotation rates)


**Example**


<CodeExample name="devicemotion">

```js
dm = devicemotion();

s1 = dm.accG
  .plot({ legend: 'Acceleration Including Gravity' });

s2 = dm.acc
  .plot({ legend: 'Acceleration' });

s3 = dm.gyro
  .plot({ legend: 'Rotation Rates' });
```

</CodeExample>


## leapmotion

```ts
 leapmotion(options: Object): Object
```

The `leapmotion` source operator listens to the data streamed by the Leap Motion<br>device.<br>The operator returns an object containing a nested set of streams. The object includes<br>a `raw` entry that creates a stream of objects containing all frame data from the Leap Motion<br>middleware, as well as a `hands` entry containing a nested structure of data streams (hand<br>position, velocity, finger attributes, etc). See below for details on the content of this<br>structure.

::: warning
This operator only works locally. The Leap Motion must be properly configured,
and the Leap Motion middleware must be installed and Running.
:::

::: tip see
For more information about the Leap Motion Device, see https://www.leapmotion.com/. For details on the LeapJS API, see https://github.com/leapmotion/leapjs
:::

::: tip TODO
Throw an error when the Leap Motion middleware is not running
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|options|Object|{}|Options|
|options.period|Number|10|Sampling period, if resampling is desired.|
**Returns** `Object` Leap Motion Data Structure, containing a nested set of streams<br>of the following form:

**Example**


<CodeExample name="leapmotion">

```js
{
  hands: {
    left: {
      visible: Stream<Boolean>
      confidence: Stream<Number>
      direction: Stream<Vector(3)>
      grabStrength: Stream<Number>
      palmPosition: Stream<Vector(3)>
      palmVelocity: Stream<Vector(3)>
      palmNormal: Stream<Vector(3)>
      pinchStrength: Stream<Number>
      sphereCenter: Stream<Vector(3)>
      sphereRadius: Stream<Number>
      thumb: {
        carpPosition: Stream<Vector(3)>
        dipPosition: Stream<Vector(3)>
        direction: Stream<Vector(3)>
        extended: Stream<Boolean>
        length: Stream<Number>
        mcpPosition: Stream<Vector(3)>
        pipPosition: Stream<Vector(3)>
        stabilizedTipPosition: Stream<Vector(3)>
        tipPosition: Stream<Vector(3)>
        tipVelocity: Stream<Vector(3)>
        width: Stream<Number>
      }
      index: <same as other fingers>
      middle: <same as other fingers>
      pinky: <same as other fingers>
      ring: <same as other fingers>
    },
    right: <same as the left hand >,
  }
  raw: <Stream of objects with thte raw datat of each frame>
}
```

</CodeExample>

**Example**


<CodeExample name="leapmotion">

```js
// Create a leapmotion listener
leap = leapmotion();

// Create a stream that tracks when the right hand is visible (see console)
rightHere = leap.hands.right.visible.skipRepeats().tap(log);

// The following lines compute the distance between the tip of the thumb and the tip of the
// index finger
rightThumb = leap.hands.right.thumb.tipPosition;
rightIndex = leap.hands.right.index.tipPosition;
thumb2index = rightThumb.distance(rightIndex).plot({ legend: 'thumb-index distance' });
```

</CodeExample>


## myo

```ts
 myo(name: String): Object
```

The myo module listens to the data emitted by the Myo armband. Rather than<br>returning a complex stream with all datatypes, the myo factory function<br>return an object containing the following streams:
- `emg`: EMG Data (vector, 8 channels)
- `acc`: accelerometer data (vector, 3D)
- `gyro`: gyroscope data (vector, 3D)
- `quat`: orientation data as quaternions (vector, 4D)
- `pose/pose_off`: beginning and end of the gestures recognized by the factory<br>myo classification (string)


::: warning
This operator only works locally. The Myo must be properly configured,
and the Myo Connect middleware must tbe installed and Running.
:::

::: tip see
For more information about the Myo Device, see https://support.getmyo.com/hc/en-us. For details on the `myo.js` API, see https://github.com/thalmiclabs/myo.js
:::

|Parameter|Type|Default|Description|
|---|---|---|---|
|name|String|''|Name of the armband|
**Returns** `Object` An object containing a set of streams, of the<br>form:```
{
  emg: Stream<format='vector', size=8>
  acc: Stream<format='vector', size=3>
  gyro: Stream<format='vector', size=3>
  quat: Stream<format='vector', size=4>
  pose/pose_off: Stream<format='string'>
}
```

**Example**


<CodeExample name="myo">

```js
// Connect to the default myo armband. You can specify the device name in argument.
m = myo();

// Plot the data streams from the IMU
acc = m.acc.plot({ legend: 'Accelerometer data' });
gyro = m.gyro.plot({ legend: 'Gyroscopes data' });
quat = m.quat.plot({ legend: 'Quaternion data (orientation)' });

// Plot the EMG data and compute and estimate of the force
emg = myo().emg
  .plot({ stacked: true, legend: 'Raw EMG data' })
  .force()
  .mvavrg({ size: 9 })
  .plot({
    stacked: true,
    fill: 'bottom',
    legend: 'Force estimation from the EMG (contraction)',
   });
```

</CodeExample>


## riot

```ts
 riot(id: Number): Object
```

Stream data from a connected R-IoT.This operator returns a data structure including the following streams:
- `acc`: acceleration
- `gyro`: gyroscopes (rotation rates)
- `quat`: quaternions (orientation)
- `euler`: euler angles (orientation)
- `magneto`: magnetometers


|Parameter|Type|Default|Description|
|---|---|---|---|
|id|Number|0|RIOT Device ID|
**Returns** `Object` data structure including the following streams:
- `acc`: acceleration
- `gyro`: gyroscopes (rotation rates)
- `quat`: quaternions (orientation)
- `euler`: euler angles (orientation)
- `magneto`: magnetometers


**Example**


<CodeExample name="riot">

```js
sm = riot();

s1 = sm.acc
  .plot({ legend: 'Acceleration' });
s2 = sm.gyro
  .plot({ legend: 'Gyroscopes' });
```

</CodeExample>


## smartphone

```ts
 smartphone(name: String): Object
```

Stream data from a connected smartphone. To connect a new smartphone, go to:
- <a href="https://playcoda.netlify.com/device" target="_blank">https://playcoda.netlify.com/device</a> if using the online version
- <a href="http://localhost:8080/device" target="_blank">http://localhost:8080/device</a> if running the playground on your machine
This object is similar to the `devicemotion` operator, it returns a Devicemotion data<br>structure, including the following streams:
- `acc`: acceleration without gravity
- `accG`: acceleration including gravity
- `gyro`: gyroscopes (rotation rates)


|Parameter|Type|Default|Description|
|---|---|---|---|
|name|String||Device name|
**Returns** `Object` Devicemotion data structure, including the following streams:
- `acc`: acceleration without gravity
- `accG`: acceleration including gravity
- `gyro`: gyroscopes (rotation rates)


**Example**


<CodeExample name="smartphone">

```js
sm = smartphone('test'); // connect your smartphone with the id 'test'

s1 = sm.accG
  .plot({ legend: 'Acceleration Including Gravity' });

s2 = sm.acc
  .plot({ legend: 'Acceleration' });

s3 = sm.gyro
  .plot({ legend: 'Rotation Rates' });
```

</CodeExample>


