# Getting Started

## Using the live-coding editor

The easiest way to get started with `coda.js` is to play around the live-coding environment. Nothing needs to be installed, you just need a **recent** browser (**Chrome** or **Firefox** are recommended). A hosted version of the playground is available online: <a href="https://animacoda.netlify.com/" target="_blank">https://animacoda.netlify.com/</a>

> Note that the hosted version has limitations regarding the use of movement sensors, that often require that you run the environment on your own computer.

## Defining and Running Streams

### Sources & Sinks

### Operators

### Types of streams

## Building a sonification system

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
