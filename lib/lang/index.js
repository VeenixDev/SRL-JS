const A = require("arcsecond");
const { bracketedExpression, groups } = require("./group");
const instructionParser = require("./instructions");
const anchors = require("./anchors");
const { optionalWhitespace } = require("./common");
const flags = require("./flags");

const parser = A.many(
  A.choice([
    instructionParser,
    anchors,
    flags,
    bracketedExpression,
    groups,
    optionalWhitespace,
  ])
);

module.exports = {
  parse(code) {
    const res = parser.run(code);

    return res.isError
      ? res
      : {
          ...res,
          result: res.result.filter((x) => typeof x !== "string"),
        };
  },
};
