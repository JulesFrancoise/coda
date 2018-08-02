import { registerContainer, generateContainerId, getContainer } from '../../src/lib/container';

test('Register a new container', () => {
  const c = registerContainer('test');
  expect(Object.keys(c)).toContain('attributes');
  expect(Object.keys(c)).toContain('buffers');
});

test('Generate a new unique container ID', () => {
  let id = generateContainerId();
  expect(id).toBe('container#0');
  registerContainer(id);
  id = generateContainerId();
  expect(id).toBe('container#1');
  registerContainer(id);
  id = generateContainerId();
  expect(id).toBe('container#2');
});

test('Access an existing container', () => {
  registerContainer('test');
  const x = getContainer('test');
  expect(x).toBeTruthy();
  expect(() => getContainer(generateContainerId())).toThrow();
});
