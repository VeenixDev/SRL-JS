const A = require("arcsecond");
const { inspect } = require("util");
const { bracketedExpression, groups } = require("./group");
const instructionParser = require("./instructions");
const anchors = require("./anchors");
const flags = require("./flags");

const deepLog = (obj) => {
  console.log(
    inspect(obj, {
      depth: Infinity,
      colors: true,
    })
  );
};

const code = [
  `START MATCH LITERAL ( !digit ) [ EXCEPT ("uwu" "test" !any) GREEDY ] UNGREEDY`,
  `[ LITERAL ("uwu2") GREEDY LITERAL ("qwq") BETWEEN ($3 $10) [ FROM ("A-Za-z0-9") MORE ($2) ] possessive ] EXACT ($3)`,
].join(" ");

const parser = A.many(
  A.choice([
    instructionParser,
    anchors,
    flags,
    bracketedExpression,
    groups,
    A.optionalWhitespace,
  ])
);
const res = parser.run(code);
deepLog({
  ...res,
  result: res.result.filter((x) => typeof x !== "string"),
});
