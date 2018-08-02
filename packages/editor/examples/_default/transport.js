// =====
// Use global transport (multiple transports allowed)
// =====
//
// TODO: Add description
//

synth1 = new MembraneSynth().toMaster();
a = transport('1n')
  .rand()
  .scale({ outmin: 24, outmax: 60 })
  .quantize({ scale: 'C major' })
  .tap(x => synth1.triggerAttackRelease(x, '8n'));

synth2 = new Synth().toMaster();
b = transport('4n')
  .rand()
  .scale({ outmin: 60, outmax: 80 })
  .quantize({ scale: 'C major' })
  .tap(x => synth2.triggerAttackRelease(x, '8n'));
