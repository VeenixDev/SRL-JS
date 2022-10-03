const { asType } = require("./util");

const constant = asType("CONSTANT");
const number = asType("NUMBER");
const string = asType("STRING");
const flag = asType("FLAG");
const anchor = asType("ANCHOR");
const quantifier = asType("QUANTIFIER");

const instruction = asType("INSTRUCTION");
const group = asType("GROUP");

module.exports = {
  constant,
  number,
  string,
  flag,
  anchor,
  quantifier,
  instruction,
  group,
};
