const containers = {};
let nextContainer = 0;

/**
 * Generate a new container id
 * @private
 * @return {String} ContainerId
 */
export function generateContainerId() {
  while (Object.keys(containers).includes(`container#${nextContainer}`)) {
    nextContainer += 1;
  }
  return `container#${nextContainer}`;
}

/**
 * Register a new shared data container
 * @private
 * @param  {String} id         Container Id
 * @param  {Object} attributes Container attributes
 * @return {Object}            The created container
 */
export function registerContainer(id, attributes) {
  if (!Object.keys(containers).includes(id)) {
    containers[id] = {
      attributes,
      buffers: {},
    };
  }
  // else ?? throw new Error(`Container ${id} already exists.`);
  return containers[id];
}

/**
 * Access a container by Id
 * @private
 * @param  {String} id         Container Id
 * @return {Object}            The container
 */
export function getContainer(id) {
  if (!Object.keys(containers).includes(id)) {
    throw new Error(`Container ${id} does not exists.`);
  }
  return containers[id];
}
