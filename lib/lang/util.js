const A = require("arcsecond");

const asType = (type) => (value) => ({ type, value });
const lowerOrUpperStr = (str) =>
  A.choice([A.str(str.toUpperCase()), A.str(str.toLowerCase())]);
const mapJoin = (parser) => parser.map((items) => items.join(""));
const last = (arr) => arr[arr.length - 1];
const peek = A.lookAhead(A.regex(/^./));

module.exports = {
  asType,
  lowerOrUpperStr,
  mapJoin,
  last,
  peek,
};
