const { parse: generateAST } = require("./lang");
const { build: generateRegex } = require("./builder");
const { deepLog } = require("./util");

module.exports = {
  generateAST,
  generateRegex,
  deepLog,
};
