const { parse: generateAST } = require("./lang");
const { build: generateRegex } = require("./builder");
const { deepLog } = require("./util");

const code = `DEFINE "part" FOR [ FROM (!digit !word "._%+-") ]

DEFINE "localpart" FOR [
  SUBROUTINE ("part") MANY1
]
DEFINE "domain" FOR [
  SUBROUTINE ("part") MANY1
]
DEFINE "tld" FOR [
  FROM (!word) BETWEEN ($2 $4)
]

SUBROUTINE ("localpart")
LITERAL ("@")
SUBROUTINE ("domain")
LITERAL (".")
SUBROUTINE ("tld")
`;
console.log(code);

const ast = generateAST(code);
console.log(generateRegex(ast));

module.exports = {
  generateAST,
  generateRegex,
};
