const A = require("arcsecond");
const T = require("./types");
const { number, ARGUMENTS_START, ARGUMENTS_END } = require("./common");
const { lowerOrUpperStr } = require("./util");

const optional = A.coroutine(function* () {
  yield lowerOrUpperStr("optional");
  yield A.optionalWhitespace;

  return T.quantifier({
    type: "optional",
    args: [],
  });
});

const many = A.coroutine(function* () {
  yield lowerOrUpperStr("many");
  yield A.optionalWhitespace;

  return T.quantifier({
    type: "many",
    args: [],
  });
});

const many1 = A.coroutine(function* () {
  yield lowerOrUpperStr("many1");
  yield A.optionalWhitespace;

  return T.quantifier({
    type: "many1",
    args: [],
  });
});

const exact = A.coroutine(function* () {
  yield lowerOrUpperStr("exact");
  yield A.optionalWhitespace;
  yield A.char(ARGUMENTS_START);
  yield A.optionalWhitespace;

  const arg1 = yield number;

  yield A.optionalWhitespace;
  yield A.char(ARGUMENTS_END);
  yield A.optionalWhitespace;

  return T.quantifier({
    type: "exact",
    args: [arg1],
  });
});

const more = A.coroutine(function* () {
  yield lowerOrUpperStr("more");
  yield A.optionalWhitespace;
  yield A.char(ARGUMENTS_START);
  yield A.optionalWhitespace;

  const arg1 = yield number;

  yield A.optionalWhitespace;
  yield A.char(ARGUMENTS_END);
  yield A.optionalWhitespace;

  return T.quantifier({
    type: "more",
    args: [arg1],
  });
});

const between = A.coroutine(function* () {
  yield lowerOrUpperStr("between");
  yield A.optionalWhitespace;
  yield A.char(ARGUMENTS_START);
  yield A.optionalWhitespace;

  const arg1 = yield number;

  yield A.whitespace;

  const arg2 = yield number;

  yield A.optionalWhitespace;
  yield A.char(ARGUMENTS_END);
  yield A.optionalWhitespace;

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
  yield A.optionalWhitespace;

  return T.quantifier({ type: "greedy", args: [] });
});

const lazy = A.coroutine(function* () {
  yield lowerOrUpperStr("lazy");
  yield A.optionalWhitespace;

  return T.quantifier({ type: "lazy", args: [] });
});

const possessive = A.coroutine(function* () {
  yield lowerOrUpperStr("possessive");
  yield A.optionalWhitespace;

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
