const { parse: generateAST } = require("./lang");
const { build: generateRegex } = require("./builder");
const { deepLog } = require("./util");

// const code = ["START MATCH", "LITERAL (!digit)", "[", "]"].join("\n");
const code = `START MATCH
  LITERAL ( !digit )
  [
    EXCEPT ("uwu" "test" !any) GREEDY
  ] UNGREEDY
  [
    LITERAL ("uwu2") GREEDY
    LITERAL ("qwq") BETWEEN ($3 $10)
    [
      FROM ("A-Za-z0-9") MORE ($2)
    ] POSSESSIVE
  ] EXACT ($3)`;

deepLog(generateAST(code));

module.exports = {
  generateAST,
  generateRegex,
};
