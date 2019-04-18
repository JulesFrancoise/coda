// Welcome to the CO/DA Playground!
//
// This live-coding editor is dedicated to interactive audio applications
// using movement as an input modality. It relies on the CO/DA library for
// movement analysis, processing, recognition, and for sound synthesis.
//
// The CO/DA library uses a stream formalism with a fluent api. Operators on a
// stream can be chained using dot-notation, as in the following example.
//
// In this example, a periodic source is generating a stream of periodic events
// occuring every 10ms. Each event is processed by the chain:
// - `rand` generates a random number of each event on the stream
// - `scale` scales the numeric stream from [0, 1] to [0, 1000]
// - `plot` displays the raw signal in the UI panel to the right
// - `biquad` applies a lowpass filter of cutoff frequency 1hz to the stream
// - `plot` displays the filtered signal in the UI panel to the right
//

// To start the stream, place your cursor in the block and type `option+enter`,
// or select the code block and type `control+enter`
a = periodic(10)
  .rand()
  .scale({ outmax: 1000 })
  .plot({ legend: 'Raw Signal'})
  .biquad({ f0: 1 })
  .plot({ legend: 'Filtered Signal'});

// Stop the stream
stop(a);

// Clear all streams
clear();
