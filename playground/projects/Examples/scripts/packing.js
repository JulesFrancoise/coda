// =====
// Unpacking and Packing streams
// =====
//
// TODO: Write description
//

// Generate a smooth random signal
signal = periodic(20)
  .rand({ size: 3 })
  .biquad({ f0: 0.5 })
  .plot({ legend: 'Initial stream' });
unpacked = signal.unpack();
s1 = unpacked[0].plot({ legend: 'First Channel' });
s2 = pack(unpacked.slice(1))
  .plot({ legend: 'Second and third channels' });

clear();
