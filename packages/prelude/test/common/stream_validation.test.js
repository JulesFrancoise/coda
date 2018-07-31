import test from 'ava';
import validateStream from '../../src/lib/validation';

test('Required attributes', (t) => {
  const specification = {
    a: {
      required: true,
    },
  };
  const values = {};
  t.throws(() => {
    validateStream('a', specification, values);
  });
});

test('No type checking', (t) => {
  const specification = {
    a: {
      required: true,
      check: null,
    },
  };
  const values = { a: 'un' };
  let attr;
  t.notThrows(() => {
    attr = validateStream('a', specification, values);
  });
  t.deepEqual(attr, values);
});

test('Enum type checking', (t) => {
  const specification = {
    a: {
      required: true,
      check: ['un', 'deux'],
    },
  };
  let attr;
  t.notThrows(() => {
    attr = validateStream('a', specification, { a: 'un' });
  });
  t.deepEqual(attr, { a: 'un' });
  t.throws(() => {
    validateStream('a', specification, { a: 'trois' });
  });
});

test('Min/Max type checking', (t) => {
  const specification = {
    a: {
      required: true,
      check: { min: 0, max: 3 },
    },
  };
  let attr;
  t.notThrows(() => {
    attr = validateStream('a', specification, { a: 2 });
  });
  t.deepEqual(attr, { a: 2 });
  t.throws(() => {
    validateStream('a', specification, { a: -1 });
  });
  t.throws(() => {
    validateStream('a', specification, { a: 4 });
  });
});

test('Functional type checking', (t) => {
  const specification = {
    a: {
      required: true,
      check: x => Math.log2(x) === Math.floor(Math.log2(x)),
    },
  };
  let attr;
  t.notThrows(() => {
    attr = validateStream('a', specification, { a: 8 });
  });
  t.deepEqual(attr, { a: 8 });
  t.throws(() => {
    validateStream('a', specification, { a: 3 });
  });
});

test('Transformation', (t) => {
  const specification = {
    a: {
      required: true,
      transform: x => 2 * x,
    },
  };
  let attr;
  t.notThrows(() => {
    attr = validateStream('a', specification, { a: 8 });
  });
  t.deepEqual(attr, { a: 16 });
});
