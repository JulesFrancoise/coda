import parseParameters from '../../src/lib/parameters';

test('Unknown parameters', () => {
  const definitions = {
    a: {
      type: 'float',
      default: 0,
    },
  };
  const values = { b: 2 };
  expect(() => parseParameters(definitions, values)).toThrow();
});

test('Unknown parameter type', () => {
  const definitions = {
    a: {
      type: 'unknown type',
    },
  };
  const values = {};
  expect(() => parseParameters(definitions, values)).toThrow();
});

test('Missing default', () => {
  const definitions = {
    a: {
      type: 'float',
    },
  };
  const values = { a: 3.2 };
  expect(() => parseParameters(definitions, values)).toThrow();
});

test('Boolean type', () => {
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
  const params = parseParameters(definitions, values);
  expect(params).toEqual({ a: true, b: true });
  values = { a: true, b: 4.1 };
  expect(() => parseParameters(definitions, values)).toThrow();
});

test('Integer type', () => {
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
  params = parseParameters(definitions, values);
  expect(params).toEqual({ a: 3, b: 10 });
  values = { a: 3, b: -120 };
  params = parseParameters(definitions, values);
  expect(params).toEqual({ a: 3, b: -23 });
  values = { a: 3.2 };
  expect(() => parseParameters(definitions, values)).toThrow();
});

test('Float type', () => {
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
  params = parseParameters(definitions, values);
  expect(params).toEqual({ a: 3.2, b: 1 });
  values = { a: 3.2, b: -120 };
  params = parseParameters(definitions, values);
  expect(params).toEqual({ a: 3.2, b: 0 });
  values = { a: false, b: 'blah' };
  expect(() => parseParameters(definitions, values)).toThrow();
});

test('String type', () => {
  const definitions = {
    a: {
      type: 'string',
      default: 'blah',
    },
  };
  let values = { a: 'test' };
  let params;
  params = parseParameters(definitions, values);
  expect(params).toEqual(values);
  values = {};
  params = parseParameters(definitions, values);
  expect(params).toEqual({ a: 'blah' });
  values = { a: 12 };
  expect(() => parseParameters(definitions, values)).toThrow();
});

test('Enum type', () => {
  const definitions = {
    a: {
      type: 'enum',
      default: 'trois',
      list: ['un', 'deux', 'trois'],
    },
  };
  let values = { a: 'deux' };
  let params;
  params = parseParameters(definitions, values);
  expect(params).toEqual(values);
  values = {};
  params = parseParameters(definitions, values);
  expect(params).toEqual({ a: 'trois' });
  values = { a: 'blah' };
  expect(() => parseParameters(definitions, values)).toThrow();
  values = { a: 12 };
  expect(() => parseParameters(definitions, values)).toThrow();
  const definitions2 = {
    a: {
      type: 'enum',
      default: 'trois',
    },
  };
  expect(() => parseParameters(definitions2, {})).toThrow();
});

test('Any type', () => {
  const definitions = {
    a: {
      type: 'any',
      default: [1, 2, 3],
    },
  };
  let values = { a: 'deux' };
  let params;
  params = parseParameters(definitions, values);
  expect(params).toEqual(values);
  values = {};
  params = parseParameters(definitions, values);
  expect(params).toEqual({ a: [1, 2, 3] });
});

test('Array type', () => {
  const definitions = {
    a: {
      type: 'array<float>',
      default: [1, 2],
    },
  };
  let values = { a: [3, 4, 5] };
  let params;
  params = parseParameters(definitions, values);
  expect(params).toEqual(values);
  values = {};
  params = parseParameters(definitions, values);
  expect(params).toEqual({ a: [1, 2] });
  values = { a: 1 };
  expect(() => parseParameters(definitions, values)).toThrow();
  values = { a: ['un', 'deux'] };
  expect(() => parseParameters(definitions, values)).toThrow();
});

test('Multiple types', () => {
  const definitions = {
    a: {
      type: 'float|string',
      default: 1,
    },
  };
  let values = { a: 'deux' };
  let params;
  params = parseParameters(definitions, values);
  expect(params).toEqual(values);
  values = {};
  params = parseParameters(definitions, values);
  expect(params).toEqual({ a: 1 });
  values = { a: 3 };
  params = parseParameters(definitions, values);
  expect(params).toEqual(values);
});
