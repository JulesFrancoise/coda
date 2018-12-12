// Example 9
// ====
//
// Granular Synthesis
//
// Exercise: transform this example to modulate the sound from the smartphone movement
//

g = granular({ file: 'twister' });
g.connect();

// Map the mouse X position to the position in the audio file
g.position = mousemove(doc).select(0);

// Map the mouse Y position to the resampling (Pitch variation)
g.resampling = mousemove(doc).select(1).scale({ outmax: 1200 });
