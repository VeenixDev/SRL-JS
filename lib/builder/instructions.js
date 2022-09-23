const constants = require("./constants");

const possibleArgTypes = Object.freeze(["STRING", "CONSTANT"]);

function concatArgs(args) {
  let result = "";

  for (let i = 0; i < args.length; i++) {
    let arg = args[i];
    if (!possibleArgTypes.includes(arg.type)) {
      throw new Error(`Illegal argument for literal, got: ${arg.type}`);
    }

    result = result.concat(
      arg.type === "STRING" ? arg.value : constants(arg.value)
    );
  }

  return result;
}

module.exports = (token, definitions, flags, handleToken) => {
  let result = "";

  switch (token.type) {
    case "from":
      result = result.concat("[");
      result = result.concat(concatArgs(token.args[0]));
      result = result.concat("]");
      break;
    case "except":
      result = result.concat("[^");
      result = result.concat(concatArgs(token.args[0]));
      result = result.concat("]");
    case "literal":
      result = result.concat(concatArgs(token.args[0]));
      break;
    case "subroutine":
      for (let i in definitions) {
        if (token.args[0].type !== "STRING") {
          throw new Error(
            `Expected subroutine arguments to be STRING, got: ${token.args[0].type}`
          );
        }
        if (definitions[i].value[0] === token.args[0].value) {
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
