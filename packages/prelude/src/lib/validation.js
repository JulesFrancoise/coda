/**
 * Check if the specification is respected for a given attribute and value,
 * and clip if relevant.
 *
 * @private
 *
 * @param  {String}        operator      Stream Operator Name (for logging)
 * @param  {String}        attribute     Attribute name
 * @param  {Specification} specification Attribute specification
 * @param  {*}             value         Attribute value
 * @return {*}                           Type-checked attribute value
 */
function checkSpec(operator, attribute, specification, value) {
  if (!specification) return;
  if (specification.constructor === Array && !specification.includes(value)) {
    throw new Error(`Stream attribute '${attribute}' (value: '${value}') is not allowed for operator '${operator}' (options: [${specification}]).`);
  } else if (specification.constructor === Object) {
    if (Object.keys(specification).includes('min') && value < specification.min) {
      throw new Error(`Stream attribute '${attribute}' (value: ${value}) is inferior to the minimum required value of ${specification.min} for operator '${operator}'.`);
    }
    if (Object.keys(specification).includes('max') && value > specification.max) {
      throw new Error(`Stream attribute '${attribute}' (value: ${value}) is superior to the maximum required value of ${specification.min} for operator '${operator}'.`);
    }
  } else if (typeof specification === 'function') {
    if (!specification(value)) {
      throw new Error(`Stream attribute '${attribute}' (value: ${value}) is incompatible with operator '${operator}'.`);
    }
  }
}

/**
 * Check the attributes of the input stream and return the attributes of the
 * output stream.
 *
 * The specification should be a structure of the form:
 * ```
 * const streamSpecification = {
 *   <attribute name>: {
 *     required: <boolean>,
 *     check: <null || Array || { min: <minimum value>, max: <maximum value>} || Function >,
 *     transform: Function,
 *   },
 * };
 * ```
 *
 * @param  {String} operator      Name of the operator for logging
 * @param  {Object} specification I/O Stream Specification
 * @param  {Object} values        Attributes of the input stream
 * @return {Object}               Attributes of the output stream
 *
 * @private
 *
 * @example
 * import setupStreamAttributes from 'stream';
 *
 * const specification = {
 *   type: {
 *     required: false,
 *     check: null,
 *     transform: x => x || null,
 *   },
 *   format: {
 *     required: true,
 *     check: ['scalar', 'vector'],
 *     transform: x => x,
 *   },
 *   size: {
 *     required: true,
 *     check: { min: 1 },
 *     transform: x => 2 * x,
 *   },
 *   stuff: {
 *     required: true,
 *     check: x => Math.log2(x) === Math.floor(Math.log2(x)),
 *     transform: x => Math.log2(x),
 *   },
 * };
 *
 * const values = {
 *   type: 'anything',
 *   format: 'vector',
 *   size: 3,
 *   stuff: 8,
 *   another: 'one',
 * };
 *
 * setupStreamAttributes('module name', specification, values);
 * // Returns:
 * // {
 * //   type: 'anything',
 * //   format: 'vector',
 * //   size: 6,
 * //   stuff: 3,
 * //   another: 'one',
 * // }
 */
export default function validateStream(operator, specification, values) {
  const attributes = Object.assign({}, values);
  Object.keys(specification).forEach((attr) => {
    const spec = specification[attr];

    // Check for required attributes
    if (spec.required && !Object.keys(values).includes(attr)) {
      throw new Error(`Stream attribute '${attr}' is required for operator '${operator}'.`);
    }

    // Check the validity of the input stream's attribute
    checkSpec(operator, attr, spec.check, values[attr]);

    attributes[attr] = spec.transform
      ? spec.transform(values[attr])
      : values[attr];
  });
  return attributes;
}
