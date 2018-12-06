// =====
// Cycle periodically through a buffer
// =====
//
// The cycle operators transforms an input stream by periodically sampling
// (or looping through) a buffer of values. The input stream acts as a trigger
// that advances through the elements of the buffer. The buffer can be defined
// either from an array (e.g. of scalars, strings or vectors) or from a string
// (in this case, the buffer is defined as an array of the string's characters).
//

a = periodic(125)
  .cycle(['A2', 'C3', 'A5', 'D1'])
  .tap(log);
