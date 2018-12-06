/**
 * Attach attributes to an existing stream
 *
 * @param  {Object} attr Attributes
 * @return {Function}    function
 */
export default function withAttr(attr) {
  return (o) => {
    o.attr = { ...attr }; // eslint-disable-line no-param-reassign
    return o;
  };
}
