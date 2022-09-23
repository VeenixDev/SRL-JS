const A = require("arcsecond");
const T = require("./types");
const { lowerOrUpperStr } = require("./util");
const { whitespace, optionalWhitespace } = require("./common");

const start = A.coroutine(function* () {
  yield lowerOrUpperStr("start");
  yield whitespace;
  const arg1 = yield A.choice([
    lowerOrUpperStr("input"),
    lowerOrUpperStr("match"),
  ]);
  yield optionalWhitespace;

  return T.anchor({
    type: arg1.toLowerCase() === "input" ? "startInput" : "startMatch",
  });
});
const end = A.coroutine(function* () {
  const absolute = yield A.possibly(lowerOrUpperStr("absolute"));
  if (absolute) {
    yield whitespace;
  }

  yield lowerOrUpperStr("end");
  yield whitespace;
  yield lowerOrUpperStr("input");
  yield optionalWhitespace;

  return T.anchor({
    type: absolute ? "absoluteEndInput" : "endInput",
  });
});

const boundary = A.coroutine(function* () {
  const word = yield A.possibly(lowerOrUpperStr("word"));
  if (word) {
    yield whitespace;
  }

  yield lowerOrUpperStr("boundary");
  yield optionalWhitespace;

  return T.anchor({
    type: word ? "wordBoundary" : "boundary",
  });
});

const anchors = A.choice([start, end, boundary]);
module.exports = anchors;
