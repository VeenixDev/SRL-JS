const { parse: generateAST } = require("./lang");
const { build: generateRegex } = require("./builder");
const { deepLog } = require("./util");

const code = `
START INPUT
LITERAL ("\\"")
[
  [ LITERAL ("\\\\\\"") ]
  OR LITERAL (!any)
] LAZY
LITERAL ("\\"")
END INPUT
`;
console.log(code);

const ast = generateAST(code);
console.log(generateRegex(ast));

module.exports = {
  generateAST,
  generateRegex,
};
