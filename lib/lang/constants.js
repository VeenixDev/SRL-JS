const A = require("arcsecond");
const T = require("./types");
const { lowerOrUpperStr } = require("./util");

const anyChar = A.char("!")
  .chain(() => lowerOrUpperStr("any"))
  .map(T.constant);
const whitespace = A.char("!")
  .chain(() => lowerOrUpperStr("whitespace"))
  .map(T.constant);
const nonWhitespace = A.char("!")
  .chain(() => lowerOrUpperStr("!whitespace"))
  .map(T.constant);
const digit = A.char("!")
  .chain(() => lowerOrUpperStr("digit"))
  .map(T.constant);
const nonDigit = A.char("!")
  .chain(() => lowerOrUpperStr("!digit"))
  .map(T.constant);
const word = A.char("!")
  .chain(() => lowerOrUpperStr("word"))
  .map(T.constant);
const nonWord = A.char("!")
  .chain(() => lowerOrUpperStr("!word"))
  .map(T.constant);
const unicode = A.char("!")
  .chain(() => lowerOrUpperStr("unicode"))
  .map(T.constant);
const dataUnit = A.char("!")
  .chain(() => lowerOrUpperStr("dataunit"))
  .map(T.constant);
const unicodeNewline = A.char("!")
  .chain(() => lowerOrUpperStr("unicodenl"))
  .map(T.constant);
const anythingButNewline = A.char("!")
  .chain(() => lowerOrUpperStr("!newline"))
  .map(T.constant);
const verticalWhitespace = A.char("!")
  .chain(() => lowerOrUpperStr("vwhitespace"))
  .map(T.constant);
const nverticalWhitespace = A.char("!")
  .chain(() => lowerOrUpperStr("!!vwhitespace"))
  .map(T.constant);
const horizontalWhitespace = A.char("!")
  .chain(() => lowerOrUpperStr("hwhitespace"))
  .map(T.constant);
const nhorizontalWhitespace = A.char("!")
  .chain(() => lowerOrUpperStr("!hwhitespace"))
  .map(T.constant);
const reset = A.char("!")
  .chain(() => lowerOrUpperStr("reset"))
  .map(T.constant);
const newline = A.char("!")
  .chain(() => lowerOrUpperStr("newline"))
  .map(T.constant);
const carriageReturn = A.char("!")
  .chain(() => lowerOrUpperStr("carriage"))
  .map(T.constant);
const tab = A.char("!")
  .chain(() => lowerOrUpperStr("tab"))
  .map(T.constant);
const nullChar = A.char("!")
  .chain(() => lowerOrUpperStr("null"))
  .map(T.constant);

const constants = A.choice([
  anyChar,
  whitespace,
  nonWhitespace,
  digit,
  nonDigit,
  word,
  nonWord,
  unicode,
  dataUnit,
  unicodeNewline,
  anythingButNewline,
  verticalWhitespace,
  nverticalWhitespace,
  horizontalWhitespace,
  nhorizontalWhitespace,
  reset,
  newline,
  carriageReturn,
  tab,
  nullChar,
]);

module.exports = constants;
