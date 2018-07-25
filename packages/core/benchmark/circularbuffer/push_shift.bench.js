import { iterations, size, value } from './options';

class PushShift {
  constructor(capacity) {
    this.buffer = [];
    this.capacity = capacity;
    this.size = 0;
    this.full = false;
  }

  push(v) {
    this.buffer.push(v);
    if (this.full) {
      this.buffer.shift();
    } else {
      this.size += 1;
      this.full = this.size === this.capacity;
    }
  }

  forEach(callback) {
    this.buffer.forEach(callback);
  }
}

function benchmark() {
  const p = new PushShift(50);
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
  `PushShift # ${iterations} x ${size}`,
  benchmark,
);
