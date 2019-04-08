// =====
// Concatenative Sound Synthesis
// =====

// Create a concatenative synthesizer using the corpus 'drum-loop'.
// Each corpus is composed of an audio file and a JSON file containing the time, duration of
// the segments
c = concatenative({
  file: 'drum-loop',
});
c.connect();

// The selected segment can be selected by index
c.index = 1;
c.index = 2;

// Randomly select a segment (between 0 and 7) on mousedown
c.index = mousedown(doc)
  .rand()
  .scale({ outmax: 8 })
  .map(x => Math.floor(x));

// The period annd duration of the segment playback can be set either relatively to the
// duration of the grain, or using an absolute value
c.periodAbs = 0.1;
c.periodRel = 0;

c.durationAbs = 0.1;
c.durationRel = 0;

// Modulate the period and duration from the mouse position
m = mousemove(doc).scale({ outmin: 1, outmax: 0 }).unpack();
c.periodRel = m[0];
c.durationRel = m[1];
