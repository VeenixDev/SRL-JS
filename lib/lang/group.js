const A = require("arcsecond");
const instructions = require("./instructions");
const T = require("./types");
const { string, whitespace, optionalWhitespace } = require("./common");
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
  yield optionalWhitespace;
  while (true) {
    const nextChar = yield peek;
    if (state === STATES.OPENING_BRACKET) {
      yield A.char("[");
      expr.push([]);
      stack.push(last(expr));
      yield optionalWhitespace;
      state = STATES.ELEMENT_OR_BRACKET;
    } else if (state === STATES.CLOSING_BRACKET) {
      yield A.char("]");
      yield optionalWhitespace;

      const quantifier = yield A.possibly(quantifierParser);
      if (quantifier) {
        yield optionalWhitespace;
        // If quantifier is last before closing it counts as quantifier for the bracketed expression
        last(stack).push(quantifier);
      }

      stack.pop();
      if (stack.length === 0) {
        // done with expression
        break;
      }
      state = STATES.ELEMENT_OR_BRACKET;
    } else if (state === STATES.ELEMENT_OR_BRACKET) {
      if (nextChar === "[") {
        state = STATES.OPENING_BRACKET;
        continue;
      } else if (nextChar === "]") {
        state = STATES.CLOSING_BRACKET;
        continue;
      }

      const element = yield A.choice([instructions, optionalWhitespace]);

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
  yield optionalWhitespace;

  const quantifier = yield A.possibly(quantifierParser);
  if (quantifier) {
    yield optionalWhitespace;
  }

  return T.group({
    type: "defaultGroup",
    quantifier:
      last(arg1.value).type === "QUANTIFIER" ? arg1.value.pop() : null,
    value: [...arg1.value],
  });
});

const atomicGroup = A.coroutine(function* () {
  yield lowerOrUpperStr("atomic");
  yield optionalWhitespace;

  const arg1 = yield _bracketedExpression;
  yield optionalWhitespace;

  const quantifier = yield A.possibly(quantifierParser);
  if (quantifier) {
    yield optionalWhitespace;
  }

  return T.group({
    type: "atmoicGroup",
    quantifier:
      last(arg1.value).type === "QUANTIFIER" ? arg1.value.pop() : null,
    value: [...arg1.value],
  });
});

const namedGroup = A.coroutine(function* () {
  yield lowerOrUpperStr("name");
  yield whitespace;

  const arg1 = yield string;
  yield whitespace;

  yield lowerOrUpperStr("for");
  yield optionalWhitespace;

  const arg2 = yield _bracketedExpression;
  yield optionalWhitespace;

  const quantifier = yield A.possibly(quantifierParser);
  if (quantifier) {
    yield optionalWhitespace;
  }

  return T.group({
    type: "namedGroup",
    quantifier:
      last(arg2.value).type === "QUANTIFIER" ? arg2.value.pop() : null,
    value: [arg1, ...arg2.value],
  });
});

const defineGroup = A.coroutine(function* () {
  yield lowerOrUpperStr("define");
  yield whitespace;

  const arg1 = yield string;
  yield whitespace;

  yield lowerOrUpperStr("for");
  yield optionalWhitespace;

  const arg2 = yield _bracketedExpression;
  yield optionalWhitespace;

  const quantifier = yield A.possibly(quantifierParser);
  if (quantifier) {
    yield optionalWhitespace;
  }

  return T.group({
    type: "defineGroup",
    quantifier:
      last(arg2.value).type === "QUANTIFIER" ? arg2.value.pop() : null,
    value: [arg1, ...arg2.value],
  });
});

const positiveLookahead = A.coroutine(function* () {
  yield lowerOrUpperStr("positive");
  yield whitespace;

  yield lowerOrUpperStr("lookahead");
  yield optionalWhitespace;

  const arg1 = yield _bracketedExpression;
  yield optionalWhitespace;

  const quantifier = yield A.possibly(quantifierParser);
  if (quantifier) {
    yield optionalWhitespace;
  }

  return T.group({
    type: "positiveLookahead",
    quantifier:
      last(arg1.value).type === "QUANTIFIER" ? arg1.value.pop() : null,
    value: [...arg1.value],
  });
});

const negativeLookahead = A.coroutine(function* () {
  yield lowerOrUpperStr("negative");
  yield whitespace;

  yield lowerOrUpperStr("lookahead");
  yield optionalWhitespace;

  const arg1 = yield _bracketedExpression;
  yield optionalWhitespace;

  const quantifier = yield A.possibly(quantifierParser);
  if (quantifier) {
    yield optionalWhitespace;
  }

  return T.instruction({
    type: "negativeLookahead",
    quantifier:
      last(arg1.value).type === "QUANTIFIER" ? arg1.value.pop() : null,
    value: [...arg1.value],
  });
});

const positiveLookbehind = A.coroutine(function* () {
  yield lowerOrUpperStr("positive");
  yield whitespace;

  yield lowerOrUpperStr("lookbehind");
  yield optionalWhitespace;

  const arg1 = yield _bracketedExpression;
  yield optionalWhitespace;

  const quantifier = yield A.possibly(quantifierParser);
  if (quantifier) {
    yield optionalWhitespace;
  }

  return T.group({
    type: "positiveLookbehind",
    quantifier:
      last(arg1.value).type === "QUANTIFIER" ? arg1.value.pop() : null,
    value: [...arg1.value],
  });
});

const negativeLookbehind = A.coroutine(function* () {
  yield lowerOrUpperStr("negative");
  yield whitespace;

  yield lowerOrUpperStr("lookbehind");
  yield optionalWhitespace;

  const arg1 = yield _bracketedExpression;
  yield optionalWhitespace;

  const quantifier = yield A.possibly(quantifierParser);
  if (quantifier) {
    yield optionalWhitespace;
  }

  return T.group({
    type: "negativeLookbehind",
    quantifier:
      last(arg1.value).type === "QUANTIFIER" ? arg1.value.pop() : null,
    value: [...arg1.value],
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
