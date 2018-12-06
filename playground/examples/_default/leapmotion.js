// ===
// Access and manipulate Leap Motion data
// ===
//
// !!! WARNING: THIS EXAMPLE ONLY WORKS LOCALLY !!!
// CO/DA needs to communicate with the Leap Motion v2 middleware, which can only be done if
// it runs locally on your computer. See documentation for details.
//
// This examples show basic use of the leapmotion source operator.
//

// Instantiate a Leap Motion source, that produces a number of data streams. The resulting Object
// has the following structure:
// {
//   hands: {
//     left: {
//       visible: Stream<Boolean>
//       confidence: Stream<Number>
//       direction: Stream<Vector(3)>
//       grabStrength: Stream<Number>
//       palmPosition: Stream<Vector(3)>
//       palmVelocity: Stream<Vector(3)>
//       palmNormal: Stream<Vector(3)>
//       pinchStrength: Stream<Number>
//       sphereCenter: Stream<Vector(3)>
//       sphereRadius: Stream<Number>
//       thumb: {
//         carpPosition: Stream<Vector(3)>
//         dipPosition: Stream<Vector(3)>
//         direction: Stream<Vector(3)>
//         extended: Stream<Boolean>
//         length: Stream<Number>
//         mcpPosition: Stream<Vector(3)>
//         pipPosition: Stream<Vector(3)>
//         stabilizedTipPosition: Stream<Vector(3)>
//         tipPosition: Stream<Vector(3)>
//         tipVelocity: Stream<Vector(3)>
//         width: Stream<Number>
//       }
//       index: <same as other fingers>
//       middle: <same as other fingers>
//       pinky: <same as other fingers>
//       ring: <same as other fingers>
//     },
//     right: <same as the left hand >,
//   }
//   raw: <Stream of objects with thte raw datat of each frame>
// }
leap = leapmotion();

// Create a stream that tracks when the right hand is visible (see console)
rightHere = leap.hands.right.visible.skipRepeats().tap(log);

// The following lines compute the distance between the tip of the thumb and the tip of the
// index finger
rightThumb = leap.hands.right.thumb.tipPosition;
rightIndex = leap.hands.right.index.tipPosition;
thumb2index = rightThumb.distance(rightIndex).plot({ legend: 'thumb-index distance' });


///////////////////////////////////////

// It is also possible to require that the data streams from the Leap Motion are resampled at a
// fixed sampling rate. This can be sett using the `period` parameter. In this example, we use a
// 10 ms sampling period, i.e. 100 Hz).

leap = leapmotion({ period: 10 });
rightHandPosition = leap.hands.right.palmPosition.plot({ legend: 'Right hand palm position' });
