const constants = require("./constants");

const possibleArgTypes = Object.freeze(["STRING", "CONSTANT"]);

function concatArgs(args, escape) {
  let result = "";

  //?+*.|$/()^[]\
  const escapeStr = (str) =>
    !escape
      ? str
      : str
          .replace(/\?/g, "\\?")
          .replace(/\./g, "\\.")
          .replace(/\[/g, "\\[")
          .replace(/\]/g, "\\]")
          .replace(/\//g, "\\/")
          .replace(/\+/g, "\\+")
          .replace(/\*/g, "\\*")
          .replace(/\(/g, "\\(")
          .replace(/\)/g, "\\)")
          .replace(/\\([^"])/g, "\\\\")
          .replace(/\^/g, "\\^")
          .replace(/\$/g, "\\$")
          .replace(/\|/g, "\\|");

  for (let i = 0; i < args.length; i++) {
    let arg = args[i];
    if (!possibleArgTypes.includes(arg.type)) {
      throw new Error(`Illegal argument for literal, got: ${arg.type}`);
    }

    result = result.concat(
      arg.type === "STRING" ? escapeStr(arg.value) : constants(arg.value)
    );
  }

  return result;
}

module.exports = (token, definitions, flags, handleToken) => {
  let result = "";

  switch (token.type) {
    case "from":
      result = result.concat("[");
      result = result.concat(concatArgs(token.args[0], false));
      result = result.concat("]");
      break;
    case "except":
      result = result.concat("[^");
      result = result.concat(concatArgs(token.args[0], false));
      result = result.concat("]");
    case "literal":
      result = result.concat(concatArgs(token.args[0], true));
      break;
    case "or":
      result = result.concat("|");
      break;
    case "subroutine":
      for (let i in definitions) {
        if (token.args[0].type !== "STRING") {
          throw new Error(
            `Expected subroutine arguments to be STRING, got: ${token.args[0].type}`
          );
        }
        // Find the definition for the subroutine
        if (definitions[i].value[0].value === token.args[0].value) {
          for (let j = 1; j < definitions[i].value.length; j++) {
            result = result.concat(
              handleToken(definitions[i].value[j], definitions, flags)
            );
          }
        }
      }
      break;
  }

  return result;
};
