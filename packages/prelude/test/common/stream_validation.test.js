import validateStream from '../../src/lib/validation';

test('Required attributes', () => {
  const specification = {
    a: {
      required: true,
    },
  };
  const values = {};
  expect(() => validateStream('a', specification, values)).toThrow();
});

test('No type checking', () => {
  const specification = {
    a: {
      required: true,
      check: null,
    },
  };
  const values = { a: 'un' };
  const attr = validateStream('a', specification, values);
  expect(attr).toEqual(values);
});

test('Enum type checking', () => {
  const specification = {
    a: {
      required: true,
      check: ['un', 'deux'],
    },
  };
  const attr = validateStream('a', specification, { a: 'un' });
  expect(attr).toEqual({ a: 'un' });
  expect(() => validateStream('a', specification, { a: 'trois' })).toThrow();
});

test('Min/Max type checking', () => {
  const specification = {
    a: {
      required: true,
      check: { min: 0, max: 3 },
    },
  };
  const attr = validateStream('a', specification, { a: 2 });
  expect(attr).toEqual({ a: 2 });
  expect(() => validateStream('a', specification, { a: -1 })).toThrow();
  expect(() => validateStream('a', specification, { a: 4 })).toThrow();
});

test('Functional type checking', () => {
  const specification = {
    a: {
      required: true,
      check: x => Math.log2(x) === Math.floor(Math.log2(x)),
    },
  };
  const attr = validateStream('a', specification, { a: 8 });
  expect(attr).toEqual({ a: 8 });
  expect(() => validateStream('a', specification, { a: 3 })).toThrow();
});

test('Transformation', () => {
  const specification = {
    a: {
      required: true,
      transform: x => 2 * x,
    },
  };
  const attr = validateStream('a', specification, { a: 8 });
  expect(attr).toEqual({ a: 16 });
});
