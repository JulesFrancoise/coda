// =====
// Access and manipulate audio from the microphone
// =====
//
// In this example, we apply a chorus effect to the input audio.
//
// !! WARNING !!
// Audio might be loud ==> use headphones
//

// Create a source from the micrphone
m = microphone();

// Create a chorus effect and connect the microphone input
c = chorus({ rate: 0.9 }).connect();
m.connect(c);

// Modulate chorus parameters
c.feedback = 0.97;
c.delay = 0.45;
c.rate = 10;
