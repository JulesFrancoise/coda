# Introduction

`coda.js` is a javascript library and live-coding environment dedicated to the design of bodily interactions with audio and visual processing.

=> [Get started with some basic examples](/guide/getting-started/)

## Why `coda.js`?

The `coda.js` library emerged in the context of the CO/DA research project at [LIMSI-CNRS](https://www.limsi.fr/), that focuses on live-coding as a practice for improvisation in interactive dance. The goal was to develop a set of tools for prototyping body-based interactions on the fly, while a dancer is improvising.

To that end, we developed a number of libraries supporting rapid design of interactions based on real-time movement information. `coda.js` integrates a number of modules for **movement sensing** (with wrappers for common devices such as the Myo Armband), **movement signal processing** (from low-level analysis blocks and filters to more advanced representations such as the wavelet transform), **mapping tools** (both for direct mapping and techniques using machine learning for recognition and regression), as well as some **sound synthesis** and effect engines.

## Features

* **Reactive**<br>`coda.js` relies on the [`most.js`](https://github.com/mostjs/core) reactive programming library, allowing for easy asynchronous data stream processing.
* **Compact Syntax**<br>`coda.js` was designed with a compact syntax allowing for rapid prototyping of movement-based interactions.
* **Multiple Devices**<br>`coda.js` integrates binding to several commercial sensing devices such as the [Myo armband](https://www.myo.com/), and easily communicates with [Cycling'74 Max 8](https://cycling74.com/)
* **Low-level Signal Processing**
* **Movement Data Visualisation**
* **Interactive Machine Learning**
* **Sound Synthesis**

## Overview

Coda is composed of a core library that extends the [`most.js`](https://github.com/mostjs/core) reactive programming library with low-level signal processing operators. The library also includes several optional packages and a live-coding environment.

![Visual overview of the coda.js library architecture](/images/coda_architecture.png)

**Packages:**

- `audio` contains sound synthesis engines and audio effects
- `max` contains operators for communication with Max/MSP
- `midi` contains MIDI processing utilities
- `ml` contains machine learning tools for recognition and mapping
- `sandbox` contains a sandboxed environment that powers the live-coding editor.
- `sensors` contains data sources for various commercial movement sensors: Myo, Leapmotion, ...
- `ui` contains UI elements for monitoring various types of signals
