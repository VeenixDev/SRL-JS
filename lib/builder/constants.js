module.exports = (value) => {
  switch (value) {
    case "any":
      return ".";
    case "whitespace":
      return "\\s";
    case "!whitespace":
      return "\\S";
    case "digit":
      return "\\d";
    case "!digit":
      return "\\D";
    case "word":
      return "\\w";
    case "!word":
      return "\\W";
    case "unicode":
      return "\\X";
    case "dataunit":
      return "\\C";
    case "uninl":
      return "\\R";
    case "!newline":
      return "\\N";
    case "vwhitespace":
      return "\\v";
    case "!vwhitespace":
      return "\\V";
    case "hwhitespace":
      return "\\h";
    case "!hwhitespace":
      return "\\H";
    case "reset":
      return "\\K";
    case "ycontrol":
      return "\\cY";
    case "backspace":
      return "[\\b]";
    case "newline":
      return "\\n";
    case "carriage":
      return "\\r";
    case "tab":
      return "\\t";
    case "null":
      return "\\0";
    default:
      throw new Error(`Unknown constant: '${value}'`);
  }
};
