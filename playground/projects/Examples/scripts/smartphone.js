sm = smartphone('bibi');

acc = sm.acc.plot({ legend: 'Acceleration' });
accG = sm.accG.plot({ legend: 'Acceleration including gravity' });
gyro = sm.gyro.plot({ legend: 'Gyroscopes (Rotation Rate)' });
