const quantifiers = require("./quantifiers");

module.exports = (group, definitions, flags, handleToken) => {
  let result = "(";
  const isNested = group.type;
  const getValue = (index) => (isNested ? group.value[index] : group[index]);

  if (isNested) {
    switch (group.type) {
      case "defaultGroup":
        // Direct break because default group has no special syntax
        break;
      case "atomicGroup":
        result = result.concat("?>");
        break;
      case "namedGroup":
        result = result.concat(`?<${getValue(0)}>`);
        break;
      case "defineGroup":
        definitions.push(group);
        return "";
      case "positiveLookahead":
        result = result.concat("?=");
        break;
      case "negativeLookahead":
        result = result.concat("?!");
        break;
      case "positiveLookbehind":
        result = result.concat("?<=");
        break;
      case "negativeLookbehind":
        result = result.concat("?<!");
        break;
      default:
        throw new Error(`Unknown group type: ${group.type}`);
    }
  }

  let limit = isNested ? group.value.length : group.length;

  for (let i = group.type === "namedGroup" ? 1 : 0; i < limit; i++) {
    let nextToken = getValue(i);
    if (nextToken.type === "QUANTIFIER") {
      if (i === limit - 1) {
        return `${result})${quantifiers(nextToken)}`;
      }

      result = result.concat(quantifiers(nextToken));
      continue;
    }
    result = result.concat(handleToken(nextToken, definitions, flags));
  }

  return result.concat(")");
};
