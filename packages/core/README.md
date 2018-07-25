# *@coda/core*: Core library for Reactive Movement Analysis

The @coda/core library is dedicated to motion signal processing using reactive programming. Mars relies on the [most](https://github.com/mostjs/core) library.

[![Build Status](https://travis-ci.com/JulesFrancoise/mars.svg?token=BxrHJGyFtm1aqazHssbW&branch=master)](https://travis-ci.com/JulesFrancoise/mars)

### Install

Using yarn: `yarn add @coda/core`

Using npm: `npm install --save @coda/core`

browser: grab the minified file here (500kb) and include it in your html page (use a `mars` global object)
<script src="mars.min.js"></script>

### Basic Example

Plot the total force from the 8 EMG sensors of the [Myo](https://myo.com) armband:

```javascript
const logEmgForce = mars.myo().emg
  .force()
  .sum()
  .plot({ fill: 'bottom' });
mars.runEffects(logEmgForce, mars.newDefaultScheduler());
```

### Modules

__Sources:__

myo / transport / xebra

__basic operators:__

add / div / elementwise / mul / sub / mean / meanstd / std / pack / pak /
max / min / minmax / prod / reduce / sum / schmitt / select / slide / unpack

__filters:__

biquad / force / mvavrg

__mapping operators:__

accum / atodb / clip / cycle / dbtoa / delta / ftom / mtof / quantize / rand / scale

__machine learning:__

train / recognize

__spectral:__

kicks / wavelet

__UI components:__

plot / heatmap / looper / recorder

### Credits

Mars has been developed at [LIMSI-CNRS](https://www.limsi.fr/en/) by [Jules Françoise](https://www.julesfrancoise.com), and is released under the MIT Licence.

Mars would not exist without the tremendous work of other open-source contributors. Mars relies on several existing libraries:
- [Most](https://github.com/mostjs/core): Monadic Event Stream
- [Waves-LFO](https://github.com/wavesjs/waves-lfo): Ircam's Low Frequency Operators
- [Vue](https://vuejs.org): The Progressive
JavaScript Framework
- [Tonal](https://github.com/danigb/tonal): A functional music theory library for Javascript
- [complex-js](https://github.com/patrickroberts/complex-js): JavaScript Complex Math
- [myo.js](https://github.com/thalmiclabs/myo.js): Myo javascript bindings
