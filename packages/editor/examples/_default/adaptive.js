// =====
// Rescale a streams from the latest myo data
// =====
//

options = {
  duration:10,
  refresh: 2,
};

a = periodic(10)
  .rand({size : 2})
  .biquad({ f0: 1 })
  .plot()
  .adaptive()
  .plot();
