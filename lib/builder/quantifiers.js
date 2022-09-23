module.exports = (quantifier) => {
  switch (quantifier.value.type) {
    case "optional":
      return "?";
    case "many":
      return "*";
    case "many1":
      return "+";
    case "exact":
      return `{${quantifier.value.args[0].value}}`;
    case "more":
      return `{${quantifier.value.args[0].value}}`;
    case "less":
      return `{0,${quantifier.value.args[0].value}}`;
    case "between":
      return `{${quantifier.value.args[0].value},${quantifier.value.args[1].value}}`;
    case "greedy":
      return "*";
    case "lazy":
      return "*?";
    default:
      throw new Error(`Unknown quantifier: ${quantifer.value.type}`);
  }
};
