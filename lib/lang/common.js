const A = require("arcsecond");
const T = require("./types");

const ARGUMENTS_START = "(";
const ARGUMENTS_END = ")";

const validIdentifier = A.regex(/^[A-Za-z!_$][A-Za-z0-9_$!]*/);

const number = A.char("$")
  .chain(() => A.digits)
  .map(T.number);
const string = A.regex(/^"((\\")|.)*?"/).map((x) =>
  T.string(x.substring(1, x.length - 1))
);
const constant = A.char("!").chain(validIdentifier).map(T.constant);

module.exports = {
  number,
  string,
  constant,
  ARGUMENTS_START,
  ARGUMENTS_END,
};
