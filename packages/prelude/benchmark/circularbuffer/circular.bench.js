import { iterations, size, value } from './options';
import CircularBuffer from '../../src/lib/circular_buffer';

function benchmark() {
  const p = new CircularBuffer(50);
  let y = 0;
  for (let i = 0; i < iterations; i += 1) {
    p.push(value);
    // eslint-disable-next-line
    p.forEach((x, j) => {
      y += x * j;
    });
  }
  return y;
}

export default suite => suite.add(
  `CircularBuffer # ${iterations} x ${size}`,
  benchmark,
);
