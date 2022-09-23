const A = require("arcsecond");
const T = require("./types");
const { lowerOrUpperStr } = require("./util");
const {
  string,
  optionalWhitespace,
  whitespace,
  ARGUMENTS_START,
  ARGUMENTS_END,
} = require("./common");
const constants = require("./constants");
const quantifierParser = require("./quantifier");

const literal = A.coroutine(function* () {
  yield lowerOrUpperStr("literal");

  yield optionalWhitespace;
  yield A.char(ARGUMENTS_START);
  yield optionalWhitespace;

  const arg1 = yield A.many1(A.choice([string, constants, whitespace]));

  yield optionalWhitespace;
  yield A.char(ARGUMENTS_END);

  yield A.possibly(optionalWhitespace);
  const quantifier = yield A.possibly(quantifierParser);
  if (quantifier) {
    yield optionalWhitespace;
  }

  return T.instruction({
    type: "literal",
    args: [arg1.filter((x) => typeof x !== "string")],
    quantifier,
  });
});

const except = A.coroutine(function* () {
  yield lowerOrUpperStr("except");
  yield optionalWhitespace;
  yield A.char(ARGUMENTS_START);
  yield optionalWhitespace;

  const arg1 = yield A.many1(A.choice([string, constants, whitespace]));

  yield optionalWhitespace;
  yield A.char(ARGUMENTS_END);

  yield A.possibly(optionalWhitespace);
  const quantifier = yield A.possibly(quantifierParser);
  yield optionalWhitespace;

  return T.instruction({
    type: "except",
    args: [arg1.filter((x) => typeof x !== "string")],
    quantifier,
  });
});

const from = A.coroutine(function* () {
  yield lowerOrUpperStr("from");
  yield optionalWhitespace;
  yield A.char(ARGUMENTS_START);
  yield optionalWhitespace;

  const arg1 = yield A.many1(A.choice([string, constants, whitespace]));

  yield optionalWhitespace;
  yield A.char(ARGUMENTS_END);

  yield A.possibly(optionalWhitespace);
  const quantifier = yield A.possibly(quantifierParser);
  yield optionalWhitespace;

  return T.instruction({
    type: "from",
    args: [arg1.filter((x) => typeof x !== "string")],
    quantifier,
  });
});

const or = A.coroutine(function* () {
  yield lowerOrUpperStr("or");

  return T.instruction({
    type: "or",
    args: [],
  });
});

const subroutine = A.coroutine(function* () {
  yield lowerOrUpperStr("subroutine");
  yield optionalWhitespace;
  yield A.char(ARGUMENTS_START);

  const arg1 = yield string;

  yield optionalWhitespace;
  yield A.char(ARGUMENTS_END);
  yield optionalWhitespace;

  yield A.possibly(optionalWhitespace);
  const quantifier = yield A.possibly(quantifierParser);
  yield optionalWhitespace;

  return T.instruction({
    type: "subroutine",
    args: [arg1],
    quantifier,
  });
});

const instructions = A.choice([literal, or, from, except, subroutine]);
module.exports = instructions;
