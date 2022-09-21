const A = require("arcsecond");
const T = require("./types");
const { lowerOrUpperStr } = require("./util");

const start = A.coroutine(function* () {
  yield lowerOrUpperStr("start");
  yield A.whitespace;
  const arg1 = yield A.choice([
    lowerOrUpperStr("input"),
    lowerOrUpperStr("match"),
  ]);
  yield A.optionalWhitespace;

  return T.anchor({
    type: arg1 === "input" ? "startInput" : "startMatch",
  });
});
const end = A.coroutine(function* () {
  const absolute = yield A.possibly(lowerOrUpperStr("absolute"));
  if (absolute) {
    yield A.whitespace;
  }

  yield lowerOrUpperStr("end");
  yield A.whitespace;
  yield lowerOrUpperStr("input");
  yield A.optionalWhitespace;

  return T.anchor({
    type: absolute ? "absoluteEndInput" : "endInput",
  });
});

const boundary = A.coroutine(function* () {
  const word = yield A.possibly(lowerOrUpperStr("word"));
  if (word) {
    yield A.whitespace;
  }

  yield lowerOrUpperStr("boundary");
  yield A.optionalWhitespace;

  return T.anchor({
    type: word ? "wordBoundary" : "boundary",
  });
});

const anchors = A.choice([start, end, boundary]);
module.exports = anchors;
