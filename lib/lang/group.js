const A = require("arcsecond");
const instructions = require("./instructions");
const T = require("./types");
const { string } = require("./common");
const { last, peek, lowerOrUpperStr } = require("./util");
const quantifierParser = require("./quantifier");

const typifyBracketedExpression = (expr) => {
  return T.group(
    expr.map((element) => {
      if (Array.isArray(element)) {
        return typifyBracketedExpression(element);
      }
      return element;
    })
  );
};

const _bracketedExpression = A.coroutine(function* () {
  const STATES = {
    OPENING_BRACKET: 0,
    ELEMENT_OR_BRACKET: 1,
    CLOSING_BRACKET: 2,
  };

  let state = STATES.ELEMENT_OR_BRACKET;
  const expr = [];
  const stack = [expr];
  yield A.char("[");
  while (true) {
    const nextChar = yield peek;
    if (state === STATES.OPENING_BRACKET) {
      yield A.char("[");
      expr.push([]);
      stack.push(last(expr));
      yield A.optionalWhitespace;
      state = STATES.ELEMENT_OR_BRACKET;
    } else if (state === STATES.CLOSING_BRACKET) {
      yield A.char("]");
      stack.pop();
      if (stack.length === 0) {
        // done with expression
        break;
      }
      yield A.optionalWhitespace;

      state = STATES.ELEMENT_OR_BRACKET;
    } else if (state === STATES.ELEMENT_OR_BRACKET) {
      if (nextChar === "[") {
        state = STATES.OPENING_BRACKET;
        continue;
      } else if (nextChar === "]") {
        state = STATES.CLOSING_BRACKET;
        continue;
      }

      const element = yield A.choice([instructions, A.optionalWhitespace]);

      if (element.type != "INSTRUCTION") continue;

      last(stack).push(element);
      state = STATES.ELEMENT_OR_BRACKET;
    } else {
      throw new Error("Unknown state");
    }
  }
  return typifyBracketedExpression(expr);
});

const bracketedExpression = A.coroutine(function* () {
  const arg1 = yield _bracketedExpression;
  yield A.optionalWhitespace;

  const quantifier = yield A.possibly(quantifierParser);
  if (quantifier) {
    yield A.optionalWhitespace;
  }

  return T.group({
    type: "defaultGroup",
    value: [...arg1.value],
    quantifier,
  });
});

const atomicGroup = A.coroutine(function* () {
  yield lowerOrUpperStr("atomic");
  yield A.optionalWhitespace;

  const arg1 = yield _bracketedExpression;
  yield A.optionalWhitespace;

  const quantifier = yield A.possibly(quantifierParser);
  if (quantifier) {
    yield A.optionalWhitespace;
  }

  return T.group({
    type: "atmoicGroup",
    value: [...arg1.value],
    quantifier,
  });
});

const namedGroup = A.coroutine(function* () {
  yield lowerOrUpperStr("name");
  yield A.whitespace;

  const arg1 = yield string;
  yield A.whitespace;

  yield lowerOrUpperStr("for");
  yield A.optionalWhitespace;

  const arg2 = yield _bracketedExpression;
  yield A.optionalWhitespace;

  const quantifier = yield A.possibly(quantifierParser);
  if (quantifier) {
    yield A.optionalWhitespace;
  }

  return T.group({
    type: "namedGroup",
    args: [arg1, ...arg2.value],
    quantifier,
  });
});

const defineGroup = A.coroutine(function* () {
  yield lowerOrUpperStr("define");
  yield A.whitespace;

  const arg1 = yield string;
  yield A.whitespace;

  yield lowerOrUpperStr("for");
  yield A.optionalWhitespace;

  const arg2 = yield _bracketedExpression;
  yield A.optionalWhitespace;

  const quantifier = yield A.possibly(quantifierParser);
  if (quantifier) {
    yield A.optionalWhitespace;
  }

  return T.group({
    type: "defineGroup",
    args: [arg1, ...arg2.value],
    quantifier,
  });
});

const positiveLookahead = A.coroutine(function* () {
  yield lowerOrUpperStr("positive");
  yield A.whitespace;

  yield lowerOrUpperStr("lookahead");
  yield A.optionalWhitespace;

  const arg1 = yield _bracketedExpression;
  yield A.optionalWhitespace;

  const quantifier = yield A.possibly(quantifierParser);
  if (quantifier) {
    yield A.optionalWhitespace;
  }

  return T.group({
    type: "positiveLookahead",
    args: [...arg1.value],
    quantifier,
  });
});

const negativeLookahead = A.coroutine(function* () {
  yield lowerOrUpperStr("negative");
  yield A.whitespace;

  yield lowerOrUpperStr("lookahead");
  yield A.optionalWhitespace;

  const arg1 = yield _bracketedExpression;
  yield A.optionalWhitespace;

  const quantifier = yield A.possibly(quantifierParser);
  if (quantifier) {
    yield A.optionalWhitespace;
  }

  return T.instruction({
    type: "negativeLookahead",
    args: [...arg1.value],
    quantifier,
  });
});

const positiveLookbehind = A.coroutine(function* () {
  yield lowerOrUpperStr("positive");
  yield A.whitespace;

  yield lowerOrUpperStr("lookbehind");
  yield A.optionalWhitespace;

  const arg1 = yield _bracketedExpression;
  yield A.optionalWhitespace;

  const quantifier = yield A.possibly(quantifierParser);
  if (quantifier) {
    yield A.optionalWhitespace;
  }

  return T.group({
    type: "positiveLookbehind",
    args: [...arg1.value],
    quantifier,
  });
});

const negativeLookbehind = A.coroutine(function* () {
  yield lowerOrUpperStr("negative");
  yield A.whitespace;

  yield lowerOrUpperStr("lookbehind");
  yield A.optionalWhitespace;

  const arg1 = yield _bracketedExpression;
  yield A.optionalWhitespace;

  const quantifier = yield A.possibly(quantifierParser);
  if (quantifier) {
    yield A.optionalWhitespace;
  }

  return T.group({
    type: "negativeLookbehind",
    args: [...arg1.value],
    quantifier,
  });
});

module.exports = {
  bracketedExpression,
  groups: A.choice([
    atomicGroup,
    namedGroup,
    defineGroup,
    positiveLookahead,
    negativeLookahead,
    positiveLookbehind,
    negativeLookbehind,
  ]),
};
