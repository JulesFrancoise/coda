# Getting Started

You can get started with `coda.js` in minutes using the live-coding environment. A version of the playground is available online:
[https://animacoda.netlify.com/](https://animacoda.netlify.com/)

However, note that the hosted version has limitations regarding the use of movement sensors, that often require that you run the environment on your own computer.

## Basic Example

TODO:

<code-example
  code="const randomSignal = periodic(10)
.rand({ size: 2 })
.plot({ legend: 'Random data (100Hz)'});

const filteredSignal = randomSignal
.biquad({ f0: 1, q: 3 }) // low-pass biquad filter
.plot({ legend: 'Filtered data'});

runEffects(filteredSignal, newDefaultScheduler());"
  name="index-codex-1"
></code-example>

## Running the Playground Locally

TODO
