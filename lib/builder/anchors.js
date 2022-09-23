module.exports = (value) => {
  switch (value.type) {
    case "startMatch":
      return "\\G";
    case "startInput":
      return "^";
    case "endInput":
      return "$";
    case "absoluteEndMatch":
      return "\\z";
    case "wordBoundary":
      return "\\b";
    case "boundary":
      return "\\B";
    default:
      throw new Error(`Unknown anchor type: ${type}`);
  }
};
