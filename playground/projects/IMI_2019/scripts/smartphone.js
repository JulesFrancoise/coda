// From your smartphone:
// -> go to https://playcoda.netlify.com/device
// -> choose a unique ID
//
// Once connected, execute the following line (alt+enter), with YOUR ID:
m = smartphone('id');

acc = m.acc.plot({ legend: 'acceleration without gravity' });
accG = m.accG.plot({ legend: 'acceleration including gravity' });
gyro = m.gyro.plot({ legend: 'Gyroscopes' });
