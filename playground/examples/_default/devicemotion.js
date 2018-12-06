// ===
// Access and manipulate DeviceMotion data (smartphones/tablets)
// ===
//
// !!! WARNING: THIS EXAMPLE ONLY WORKS ONN A SMARTPHONE OR TABLET !!!
// The DeviceMotion API is not implemented on all devices
//

dm = devicemotion();

s1 = dm.accelerationG
  .resample(periodic(10))
  .mvavrg({ size: 7 })
  .plot({ legend: 'Acceleration Including Gravity' });

s2 = dm.acceleration
  .resample(periodic(10))
  .mvavrg({ size: 7 })
  .plot({ legend: 'Acceleration' });

s3 = dm.orientation
  .resample(periodic(10))
  .mvavrg({ size: 7 })
  .plot({ legend: 'Orientation' });
