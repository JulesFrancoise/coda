// Benchmarking options
export const iterations = 10000;
export const size = 1;
export const value = size > 1 ?
  Array.from(Array(size), () => Math.random()) :
  Math.random();
