const A = require("arcsecond");
const T = require("./types");
const {
  number,
  optionalWhitespace,
  whitespace,
  ARGUMENTS_START,
  ARGUMENTS_END,
} = require("./common");
const { lowerOrUpperStr } = require("./util");

const optional = A.coroutine(function* () {
  yield lowerOrUpperStr("optional");
  yield optionalWhitespace;

  return T.quantifier({
    type: "optional",
    args: [],
  });
});

const many = A.coroutine(function* () {
  yield lowerOrUpperStr("many");
  yield optionalWhitespace;

  return T.quantifier({
    type: "many",
    args: [],
  });
});

const many1 = A.coroutine(function* () {
  yield lowerOrUpperStr("many1");
  yield optionalWhitespace;

  return T.quantifier({
    type: "many1",
    args: [],
  });
});

const exact = A.coroutine(function* () {
  yield lowerOrUpperStr("exact");
  yield optionalWhitespace;
  yield A.char(ARGUMENTS_START);
  yield optionalWhitespace;

  const arg1 = yield number;

  yield optionalWhitespace;
  yield A.char(ARGUMENTS_END);
  yield optionalWhitespace;

  return T.quantifier({
    type: "exact",
    args: [arg1],
  });
});

const more = A.coroutine(function* () {
  yield lowerOrUpperStr("more");
  yield optionalWhitespace;
  yield A.char(ARGUMENTS_START);
  yield optionalWhitespace;

  const arg1 = yield number;

  yield optionalWhitespace;
  yield A.char(ARGUMENTS_END);
  yield optionalWhitespace;

  return T.quantifier({
    type: "more",
    args: [arg1],
  });
});

const between = A.coroutine(function* () {
  yield lowerOrUpperStr("between");
  yield optionalWhitespace;
  yield A.char(ARGUMENTS_START);
  yield optionalWhitespace;

  const arg1 = yield number;

  yield whitespace;

  const arg2 = yield number;

  yield optionalWhitespace;
  yield A.char(ARGUMENTS_END);
  yield optionalWhitespace;

  if (Number(arg1.value) > Number(arg2.value)) {
    throw new Error(
      "[between] The first argument has to be smaller or equal than the second argument"
    );
  }

  return T.quantifier({
    type: "between",
    args: [arg1, arg2],
  });
});

const greedy = A.coroutine(function* () {
  yield lowerOrUpperStr("greedy");
  yield optionalWhitespace;

  return T.quantifier({ type: "greedy", args: [] });
});

const lazy = A.coroutine(function* () {
  yield lowerOrUpperStr("lazy");
  yield optionalWhitespace;

  return T.quantifier({ type: "lazy", args: [] });
});

const possessive = A.coroutine(function* () {
  yield lowerOrUpperStr("possessive");
  yield optionalWhitespace;

  return T.quantifier({ type: "possessive", args: [] });
});

module.exports = A.choice([
  optional,
  many1,
  many,
  exact,
  more,
  between,
  greedy,
  lazy,
  possessive,
]);
