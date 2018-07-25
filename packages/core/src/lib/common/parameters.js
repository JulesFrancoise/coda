/**
 * Simplified version of @ircam/parameters
 * @see {@link https://github.com/ircam-jstools/parameters}
 *
 * The @ircam/parameters library has been developed at Ircam – Centre Pompidou
 * and is released under the BSD-3-Clause license.
 *
 * @author Benjamin Matuszewski
 */

/**
 * Clip parameter values
 * @ignore
 */
function clip(value, lower = -Infinity, upper = +Infinity) {
  return Math.max(lower, Math.min(upper, value));
}

/**
 * Parameter templates
 * @ignore
 */
const paramTemplates = {
  boolean: {
    definitionTemplate: ['default'],
    typeCheckFunction(value, definition, name) {
      if (typeof value !== 'boolean') {
        throw new Error(`Invalid value for boolean param "${name}": ${value}`);
      }
      return value;
    },
  },
  integer: {
    definitionTemplate: ['default'],
    typeCheckFunction(value, definition, name) {
      if (!(typeof value === 'number' && Math.floor(value) === value)) {
        throw new Error(`Invalid value for integer param "${name}": ${value}`);
      }
      return clip(value, definition.min, definition.max);
    },
  },
  float: {
    definitionTemplate: ['default'],
    typeCheckFunction(value, definition, name) {
      if (typeof value !== 'number') {
        throw new Error(`Invalid value for float param "${name}": ${value}`);
      }
      return clip(value, definition.min, definition.max);
    },
  },
  string: {
    definitionTemplate: ['default'],
    typeCheckFunction(value, definition, name) {
      if (typeof value !== 'string') {
        throw new Error(`Invalid value for string param "${name}": ${value}`);
      }
      return value;
    },
  },
  enum: {
    definitionTemplate: ['default', 'list'],
    typeCheckFunction(value, definition, name) {
      if (definition.list.indexOf(value) === -1) {
        throw new Error(`Invalid value for enum param "${name}": ${value}`);
      }
      return value;
    },
  },
  any: {
    definitionTemplate: ['default'],
    typeCheckFunction(value) {
      // no check as it can have any type...
      return value;
    },
  },
};

/**
 * Create a parameters structure from a set of definitions and new values.
 *
 * Simplified version of @ircam/parameters.
 * The @ircam/parameters library has been developed at Ircam – Centre Pompidou
 * and is released under the BSD-3-Clause license.
 *
 * @author Benjamin Matuszewski
 * @author Jules Françoise
 *
 * @see {@link https://github.com/ircam-jstools/parameters}
 *
 * @param  {Object} definitions  Paramater structure definition
 * @param  {Object} [options={}] Overloaded options
 * @return {Object}              The final parameter set
 *
 * @private
 *
 * @throws Will throw an error if:
 * - the type of the parameter is unknown
 * - parameter has a wrong definition
 * - parameter has an invalid value
 */
export default function parseParameters(definitions, options = {}) {
  const paramList = Object.keys(definitions);
  const optList = Object.keys(options);

  optList.forEach((name) => {
    if (!paramList.includes(name)) {
      throw new Error(`Unknown parameter '${name}'.`);
    }
  });

  const params = paramList.map((name) => {
    const definition = definitions[name];

    if (!paramTemplates[definition.type]) {
      throw new Error(`Unknown param type "${definition.type}"`);
    }

    const {
      definitionTemplate,
      typeCheckFunction,
    } = paramTemplates[definition.type];

    definitionTemplate.forEach((key) => {
      if (!Object.keys(definition).includes(key)) {
        throw new Error(`Invalid definition for param "${name}", ${key} is not defined`);
      }
    });

    const value = (optList.includes(name)) ?
      typeCheckFunction(options[name], definition, name) :
      definition.default;
    return { [name]: value };
  }).reduce((p, o) => Object.assign({}, p, o), {});

  return params;
}
