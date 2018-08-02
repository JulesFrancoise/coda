import CircularBuffer from '../../src/lib/circular_buffer';

test('Instanciate a buffer', () => {
  const buffer = new CircularBuffer(10);
  expect(buffer.capacity).toBe(10);
  expect(buffer.length).toBe(0);
  expect(buffer.index).toBe(0);
  expect(buffer.full).toBe(false);
  expect(buffer.buffer).toEqual([]);
});

test('Push elements', () => {
  const buffer = new CircularBuffer(10);
  const input = Array.from(Array(15), (_, i) => i);
  input.forEach((x) => {
    buffer.push(x);
  });
  expect(buffer.length).toBe(10);
  expect(buffer.full).toBe(true);
  for (let i = 0; i < 10; i += 1) {
    expect(buffer.get(i)).toBe(i + 5);
  }
  expect(buffer.values()).toEqual(input.slice(5));
  buffer.forEach((x, i) => {
    expect(x).toBe(i + 5);
  });
});

test('Fill buffer', () => {
  const buffer = new CircularBuffer(5);
  buffer.fill(12);
  expect(buffer.length).toBe(5);
  expect(buffer.full).toBe(true);
  for (let i = 0; i < 10; i += 1) {
    expect(buffer.get(i)).toBe(12);
  }
  expect(buffer.values()).toEqual([12, 12, 12, 12, 12]);
  buffer.forEach((x) => {
    expect(x).toBe(12);
  });
});
