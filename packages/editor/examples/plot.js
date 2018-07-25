// =====
// Plot: UI component for monitoring scalar and vector streams
// =====
//
// The plot operator displays a sliding window of the incoming (scalar or
// vector) data stream. There are several graphical options including stacking
// and color filling.
//

// basic plot
a = periodic(20)
  .rand({ size: 2 })
  .plot()
  .biquad({ f0: 2 })
  .plot();

// Stacked Curves
b = periodic(20)
  .rand({ size: 2 })
  .biquad({ f0: 2 })
  .plot({ stacked: true });

// Filling
c = periodic(20)
  .rand()
  .biquad({ f0: 2 })
  .plot({ fill: 'none' })
  .plot({ fill: 'bottom' })
  .plot({ fill: 'middle' })
  .plot({ fill: 'top' });
