module.exports = (flag) => {
  switch (flag.toUpperCase()) {
    case "MULTILINE":
      return "m";
    case "GLOBAL":
      return "g";
    case "CASE INSENSITIVE":
      return "i";
    case "STICKY":
      return "y";
    case "UNICODE":
      return "u";
    case "SINGLE LINE":
      return "s";
    case "INDECIES":
      return "d";
    default:
      throw new Error(`Unknown flag: ${type}`);
  }
};
