const A = require("arcsecond");
const T = require("./types");
const { lowerOrUpperStr } = require("./util");

const global = lowerOrUpperStr("global").map(T.flag);
const multiline = lowerOrUpperStr("multiline").map(T.flag);
const caseInsensitive = lowerOrUpperStr("case insensitive").map(T.flag);
const verbose = lowerOrUpperStr("verbose").map(T.flag);
const singleLine = lowerOrUpperStr("single line").map(T.flag);
const unicode = lowerOrUpperStr("unicode").map(T.flag);
const extra = lowerOrUpperStr("extra").map(T.flag);
const ungreedy = lowerOrUpperStr("ungreedy").map(T.flag);
const anchor = lowerOrUpperStr("anchor").map(T.flag);
const duplicateGroup = lowerOrUpperStr("duplicate group").map(T.flag);

const flags = A.choice([
  global,
  multiline,
  caseInsensitive,
  verbose,
  singleLine,
  unicode,
  extra,
  ungreedy,
  anchor,
  duplicateGroup,
]);
module.exports = flags;
