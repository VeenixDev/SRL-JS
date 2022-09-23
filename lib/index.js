const { parse: generateAST } = require("./lang");
const { build: generateRegex } = require("./builder");
const { deepLog } = require("./util");

// const code = `LITERAL (!digit !word "test") between ($3 $5)`;
const code = `START INPUT
  LITERAL ( !digit ) LAZY
  [
    EXCEPT ("uwu" "test" !any) GREEDY
  ] less($8)
  [
    LITERAL ("uwu2") GREEDY
    LITERAL ("qwq") BETWEEN ($3 $10)
    [
      FROM ("A-Za-z0-9") MORE ($2)
    ] MANY1
  ] EXACT ($3)
  MULTILINE`;

const ast = generateAST(code);

// deepLog(ast);
console.log(generateRegex(ast));

module.exports = {
  generateAST,
  generateRegex,
};
