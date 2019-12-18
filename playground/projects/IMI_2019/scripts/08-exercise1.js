// Exercise 1
// ====
//
// => Create a system that triggers a sound when a kick is performed on a smartphone
//

// From your smartphone:
// -> go to https://playcoda.netlify.com/device
// -> choose a unique ID
//
// Once connected, execute the following line (alt+enter), with YOUR ID:
m = smartphone('xxx');

// To access the acceleration:
acc = m.acc.plot({ legend: 'Acceleration without gravity '});

// => Perform analysis here

// [hint] to play a sound:
p = sampler({ file: 'ding' }).connect();

p.trigger = true;
// p.trigger = Stream<Boolean>
