const A = require("arcsecond");
const T = require("./types");
const { lowerOrUpperStr } = require("./util");

const global = lowerOrUpperStr("global").map(T.flag);
const multiline = lowerOrUpperStr("multiline").map(T.flag);
const caseInsensitive = lowerOrUpperStr("case insensitive").map(T.flag);
const singleLine = lowerOrUpperStr("single line").map(T.flag);
const unicode = lowerOrUpperStr("unicode").map(T.flag);
const sticky = lowerOrUpperStr("sticky").map(T.flag);

const flags = A.choice([
  global,
  multiline,
  caseInsensitive,
  singleLine,
  unicode,
  sticky,
]);
module.exports = flags;
