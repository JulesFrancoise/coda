// =====
// Create streams from myo data
// =====
//
// !!! WARNING: THIS EXAMPLE ONLY WORKS LOCALLY !!!
// CO/DA needs to communicate with Myo Connect, which can only be done if
// it runs locally on your computer. See documentation for details.
//
// The `myo` operator does not generate a single stream but returns an object
// containing a number of streams for each data type:
// - `acc`: accelerometer signals
// - `gyro`: gyroscope signals
// - `quat`: orientation (represented as quaternions)
// - `emg`: emg data
//

// Connect to the default myo armband. You can specify the device name in argument.
m = myo();

// Plot the data streams from the IMU
acc = m.acc.plot({ legend: 'Accelerometer data' });
gyro = m.gyro.plot({ legend: 'Gyroscopes data' });
quat = m.quat.plot({ legend: 'Quaternion data (orientation)' });

// Plot the EMG data and compute and estimate of the force
emg = myo().emg
  .plot({ stacked: true, legend: 'Raw EMG data' })
  .force()
  .mvavrg({ size: 9 })
  .plot({ stacked: true, fill: 'bottom', legend: 'Force estimation from the EMG (contraction)' });
