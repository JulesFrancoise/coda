import KNN from '../../src/lib/knn';

test('Basic test', () => {
  const data = Array.from(Array(100), () => [Math.random(), Math.random()]);
  const knn = new KNN(data, { k: 3 });
  const closest = knn.predict([0.5, 0.5]);
  expect(closest.length).toBe(3);
  expect(closest[0].data.length).toBe(2);
  expect(typeof closest[0].index).toBe('number');
  expect(typeof closest[0].distance).toBe('number');
});
