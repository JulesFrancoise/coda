/** From @most/core:
 * https://github.com/mostjs/core/blob/master/packages/core/test/
 */
/** @license MIT License (c) copyright 2010-2015 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

export const approxEqual = (a, b, error = 0) => (
  Math.abs(a - b) < error + Number.EPSILON
);

export const approxArrayEqual = (u, v, error = 0) => (
  u.map((x, i) => approxEqual(x, v[i], error))
);

export const allTrue = u => u.reduce((t, x) => t && x, true);
