const { parse: generateAST } = require("./lang");
const { build: generateRegex } = require("./builder");
const { deepLog } = require("./util");

const code = `
IF ([LITERAL ("foo")]) THEN [LITERAL ("Bar")] ELSE [ LITERAL ("barFoo")]
`;
// console.log(code);

const ast = generateAST(code);
console.log(deepLog(ast));
console.log(generateRegex(ast));

module.exports = {
  generateAST,
  generateRegex,
};
