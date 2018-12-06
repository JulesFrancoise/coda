# @coda/audio
## Reactive Webaudio Synths & FX

[TODO] Description

### Install

Using yarn: `yarn add @coda/audio`

Using npm: `npm install --save @coda/audio`

### Modules

__Synth:__

All synthesizers use the excellent [wavesjs](https://github.com/wavesjs/waves-audio) library:
- `granular`: Granular Synthesis
- `concatenative`: Concatenative Sound Synthesis
- `catart`: Descriptor-driven Concatenative Sound Synthesis, in the style of [Catart](http://ismm.ircam.fr/catart/).
- `sampler`: Simple sample player engine

__FX:__

- `bitcrusher`
- `convolver`
- `chorus`
- `compressor`
- `filt`
- `moogFilter`
- `overdrive`
- `phaser`
- `panner`
- `pingpong`
- `tremolo`

Most effects come from the [Tuna.js](https://github.com/Theodeus/tuna) Audio effects library.
