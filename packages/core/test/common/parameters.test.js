import test from 'ava';
import parseParameters from '../../src/lib/common/parameters';

test('Unknown parameters', (t) => {
  const definitions = {
    a: {
      type: 'float',
      default: 0,
    },
  };
  const values = { b: 2 };
  t.throws(() => {
    parseParameters(definitions, values);
  });
});

test('Unknown parameter type', (t) => {
  const definitions = {
    a: {
      type: 'unknown type',
    },
  };
  const values = {};
  t.throws(() => {
    parseParameters(definitions, values);
  });
});

test('Missing default', (t) => {
  const definitions = {
    a: {
      type: 'float',
    },
  };
  const values = { a: 3.2 };
  t.throws(() => {
    parseParameters(definitions, values);
  });
});

test('Boolean type', (t) => {
  const definitions = {
    a: {
      type: 'boolean',
      default: false,
    },
    b: {
      type: 'boolean',
      default: true,
    },
  };
  let values = { a: true };
  let params;
  t.notThrows(() => {
    params = parseParameters(definitions, values);
  });
  t.deepEqual(params, { a: true, b: true });
  values = { a: true, b: 4.1 };
  t.throws(() => {
    params = parseParameters(definitions, values);
  });
});

test('Integer type', (t) => {
  const definitions = {
    a: {
      type: 'integer',
      default: 0,
    },
    b: {
      type: 'integer',
      default: 0,
      min: -23,
      max: 10,
    },
  };
  let values = { a: 3, b: 13 };
  let params;
  t.notThrows(() => {
    params = parseParameters(definitions, values);
  });
  t.deepEqual(params, { a: 3, b: 10 });
  values = { a: 3, b: -120 };
  t.notThrows(() => {
    params = parseParameters(definitions, values);
  });
  t.deepEqual(params, { a: 3, b: -23 });
  values = { a: 3.2 };
  t.throws(() => {
    params = parseParameters(definitions, values);
  });
});

test('Float type', (t) => {
  const definitions = {
    a: {
      type: 'float',
      default: 0,
    },
    b: {
      type: 'float',
      default: 0,
      min: 0,
      max: 1,
    },
  };
  let values = { a: 3.2, b: 4.1 };
  let params;
  t.notThrows(() => {
    params = parseParameters(definitions, values);
  });
  t.deepEqual(params, { a: 3.2, b: 1 });
  values = { a: 3.2, b: -120 };
  t.notThrows(() => {
    params = parseParameters(definitions, values);
  });
  t.deepEqual(params, { a: 3.2, b: 0 });
  values = { a: false, b: 'blah' };
  t.throws(() => {
    params = parseParameters(definitions, values);
  });
});

test('String type', (t) => {
  const definitions = {
    a: {
      type: 'string',
      default: 'blah',
    },
  };
  let values = { a: 'test' };
  let params;
  t.notThrows(() => {
    params = parseParameters(definitions, values);
  });
  t.deepEqual(params, values);
  values = {};
  t.notThrows(() => {
    params = parseParameters(definitions, values);
  });
  t.deepEqual(params, { a: 'blah' });
  values = { a: 12 };
  t.throws(() => {
    params = parseParameters(definitions, values);
  });
});

test('Enum type', (t) => {
  const definitions = {
    a: {
      type: 'enum',
      default: 'trois',
      list: ['un', 'deux', 'trois'],
    },
  };
  let values = { a: 'deux' };
  let params;
  t.notThrows(() => {
    params = parseParameters(definitions, values);
  });
  t.deepEqual(params, values);
  values = {};
  t.notThrows(() => {
    params = parseParameters(definitions, values);
  });
  t.deepEqual(params, { a: 'trois' });
  values = { a: 'blah' };
  t.throws(() => {
    params = parseParameters(definitions, values);
  });
  values = { a: 12 };
  t.throws(() => {
    params = parseParameters(definitions, values);
  });
  const definitions2 = {
    a: {
      type: 'enum',
      default: 'trois',
    },
  };
  t.throws(() => {
    params = parseParameters(definitions2, {});
  });
});

test('Any type', (t) => {
  const definitions = {
    a: {
      type: 'any',
      default: [1, 2, 3],
    },
  };
  let values = { a: 'deux' };
  let params;
  t.notThrows(() => {
    params = parseParameters(definitions, values);
  });
  t.deepEqual(params, values);
  values = {};
  t.notThrows(() => {
    params = parseParameters(definitions, values);
  });
  t.deepEqual(params, { a: [1, 2, 3] });
});
