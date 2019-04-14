//
// Simplified version of @ircam/parameters
// @see {@link https://github.com/ircam-jstools/parameters}
//
// The @ircam/parameters library has been developed at Ircam – Centre Pompidou
// and is released under the BSD-3-Clause license.
//
// @author Benjamin Matuszewski
//

/**
 * Clip parameter values
 * @ignore
 *
 * @param  {Number} value             value
 * @param  {Number} [lower=-Infinity] lower bound
 * @param  {Number} [upper=+Infinity] upper bound
 * @return {Number}                   Clipped value
 */
function clipVal(value, lower = -Infinity, upper = +Infinity) {
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
      return clipVal(value, definition.min, definition.max);
    },
  },
  float: {
    definitionTemplate: ['default'],
    typeCheckFunction(value, definition, name) {
      if (typeof value !== 'number') {
        throw new Error(`Invalid value for float param "${name}": ${value}`);
      }
      return clipVal(value, definition.min, definition.max);
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

Object.keys(paramTemplates).forEach((type) => {
  paramTemplates[`array<${type}>`] = {
    definitionTemplate: ['default'],
    typeCheckFunction(value, definition, name) {
      if (!Array.isArray(value)) {
        throw new Error(`Invalid value for array<${type}> param "${name}": ${value} is not an array`);
      }
      try {
        return value.map(x => paramTemplates[type].typeCheckFunction(x, definition, name));
      } catch (e) {
        throw new Error(`Invalid value for array<${type}> param "${name}": ${value}`);
      }
    },
  };
});

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
    const types = definition.type.split('|');
    types.forEach((type) => {
      if (!paramTemplates[type]) {
        throw new Error(`Unknown param type "${type}"`);
      }
      const { definitionTemplate } = paramTemplates[type];

      definitionTemplate.forEach((key) => {
        if (!Object.keys(definition).includes(key)) {
          throw new Error(`Invalid definition for param "${name}", ${key} is not defined`);
        }
      });
    });
    if (!optList.includes(name)) {
      return { [name]: definition.default };
    }
    let error = new Error(`Invalid definition for param "${name}": type checking failed for all types.`);
    for (let i = 0; i < types.length; i += 1) {
      const type = types[i];

      const { typeCheckFunction } = paramTemplates[type];

      try {
        const value = typeCheckFunction(options[name], definition, name);
        return { [name]: value };
      } catch (e) {
        error = e;
        if (types.length === 1) {
          error = e;
        }
      }
    }
    throw error;
  }).reduce((p, o) => Object.assign({}, p, o), {});

  return params;
}
