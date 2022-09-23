const anchors = require("./anchors");
const flags = require("./flags");
const quantifiers = require("./quantifiers");
const groups = require("./groups");
const instructions = require("./instructions");

function build(ast) {
  let result = "";
  let knownDefinitions = [];
  let knownFlags = [];

  if (ast.isError) {
    throw new Error("AST is not valid");
  }

  for (let t of ast.result) {
    result = result.concat(buildToken(t, knownDefinitions, knownFlags));
  }

  return new RegExp(result /*, flags */);
}

function buildToken(token, definitions, flags) {
  let result = "";
  switch (token.type) {
    case "ANCHOR":
      result = result.concat(anchors(token.value));
      break;
    case "FLAG":
      flags.push(token.value);
      break;
    case "GROUP":
      result = result.concat(
        groups(token.value, definitions, flags, buildToken)
      );
      break;
    case "INSTRUCTION":
      result = result.concat(
        instructions(token.value, definitions, flags, buildToken)
      );
      break;
    default:
      throw new Error(`Unknown token type: ${token.type}`);
  }

  if (token.value.quantifier) {
    const qualifier = quantifiers(token.value.quantifier);
    result = result.concat(qualifier);
  }

  return result;
}

module.exports = {
  build,
};
