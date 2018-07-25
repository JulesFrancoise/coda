// =====
// Create streams from myo data
// =====
//
// !!! WARNING: THIS EXAMPLE ONLY WORKS LOCALLY !!!
// Solar needs to communicate with Myo Connect, which can only be done if
// it runs locally on your computer.
// TODO: Needs details.
//
// The `myo` operator does not generate a single stream but returns an object
// containing a number of streams for each data type:
// - `acc`: accelerometer signals
// - `gyro`: gyroscope signals
// - `quat`: orientation (represented as quaternions)
// - `emg`: emg data
//

m = myo();
acc = m.acc.plot();
gyro = m.gyro.plot();
quat = m.quat.plot();

emg = myo().emg
  .plot({ stacked: true })
  .force()
  .mvavrg({ size: 12 })
  .plot({ stacked: true, fill: 'bottom' });
