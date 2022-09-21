const A = require("arcsecond");
const T = require("./types");
const { lowerOrUpperStr } = require("./util");
const { string, ARGUMENTS_START, ARGUMENTS_END } = require("./common");
const constants = require("./constants");
const quantifierParser = require("./quantifier");

const literal = A.coroutine(function* () {
  yield lowerOrUpperStr("literal");

  yield A.optionalWhitespace;
  yield A.char(ARGUMENTS_START);
  yield A.optionalWhitespace;

  const arg1 = yield A.many1(A.choice([string, constants, A.whitespace]));

  yield A.optionalWhitespace;
  yield A.char(ARGUMENTS_END);

  yield A.optionalWhitespace;
  const quantifier = yield A.possibly(quantifierParser);
  if (quantifier) {
    yield A.optionalWhitespace;
  }

  return T.instruction({
    type: "literal",
    args: [arg1.filter((x) => x !== " ")],
    quantifier,
  });
});

const except = A.coroutine(function* () {
  yield lowerOrUpperStr("except");
  yield A.optionalWhitespace;
  yield A.char(ARGUMENTS_START);
  yield A.optionalWhitespace;

  const arg1 = yield A.many1(A.choice([string, constants, A.whitespace]));

  yield A.optionalWhitespace;
  yield A.char(ARGUMENTS_END);

  yield A.possibly(A.optionalWhitespace);
  const quantifier = yield A.possibly(quantifierParser);
  yield A.optionalWhitespace;

  return T.instruction({
    type: "except",
    args: [arg1.filter((x) => x !== " ")],
    quantifier,
  });
});

const from = A.coroutine(function* () {
  yield lowerOrUpperStr("from");
  yield A.optionalWhitespace;
  yield A.char(ARGUMENTS_START);
  yield A.optionalWhitespace;

  const arg1 = yield A.many1(A.choice([string, constants, A.whitespace]));

  yield A.optionalWhitespace;
  yield A.char(ARGUMENTS_END);

  yield A.possibly(A.optionalWhitespace);
  const quantifier = yield A.possibly(quantifierParser);
  yield A.optionalWhitespace;

  return T.instruction({
    type: "from",
    args: [arg1.filter((x) => x !== " ")],
    quantifier,
  });
});

const instructions = A.choice([literal, from, except]);
module.exports = instructions;
