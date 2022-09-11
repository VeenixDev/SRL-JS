let input = `testtesttestTTTTT`
let code = `"abc" FOR [ REPEAT $3 ("test") ] REPEAT $5 ("T")`;

const STRING_LITERAL = "\"";

function check(test, input) {
  let regexp = compileToRegExp(test);
  console.log(regexp);
  return regexp.test(input);
}

function tokenize(code) {
  let tokens = [];
  let index = 0;
  let lastToken = "";

  const ESCAPE_SEQUENCES = Object.freeze(["n", "r", "t", "b", "\""]);
  const EXPRESSIONS = Object.freeze(["FOR", "REPEAT"]);
  const GROUPS = Object.freeze(["[", "]", "(", ")", "<", ">"]);

  const pushToken = (token) => {
    tokens.push(token ? token : {type: "unknown", value: lastToken});
    lastToken = "";
  }

  while(index < code.length) {
    if(code[index] === " ") {
      if(lastToken !== "") {
        if(EXPRESSIONS.includes(lastToken)) {
          pushToken({type: "expression" ,value: lastToken});
        } else if(GROUPS.includes(lastToken)) {
          pushToken({type: "group" ,value: lastToken});
        } else {
          if(lastToken.startsWith("$")) {
            pushToken({type: "number", value: Number(lastToken.substring(1))});
          } else {
            pushToken({type: "unknown" ,value: lastToken});
          }
        }
      }
    } else if(code[index] === "(" || code[index] === ")") {
      pushToken({type: "group", value: code[index]});
    }else if(code[index] === '"') {
      pushToken();
      let stringLiteral = "";
      while(index < code.length) {
        index++;
        if(code[index] === "\\") {
          if (ESCAPE_SEQUENCES.includes(code[index + 1])) {
            stringLiteral += "\\";
            stringLiteral += code[++index];
          }
        } else if(code[index] === "\"") {
          pushToken({type: "string" ,value: stringLiteral});
          break;
        } else {
          stringLiteral += code[index];
        }
      }
    } else {
      lastToken += code[index];
    }
    index++;
  }

  if(lastToken != "") {
    pushToken({type: "end", value: lastToken});
  }

  return tokens.filter((token) => token.value !== "");
}

function compileToRegExp(code) {
  let split = tokenize(code);
  let index = 0;
  let openParentheses = 0;
  let openSquareBracket = 0;
  let openAngleBrackets = 0;

  const escapePattern = (token) => {
    return token.replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(/"/g, "\\\"");
  }
  const checkType = (expression, expected, token) => {
    if(token.type === expected) {
      return;
    }
    throw new Error(`Illegal type for ${expression} at: ${index} | Expected '${expected}' got '${token.type}'`);
  }
  const checkToken = (expression, expected, token) => {
    if(expected.type == token.type && expected.value == token.value) {
      return;
    }
    throw new Error(`Illegal expression for ${expression} at: ${index} | Expected ${JSON.stringify(expected)} got ${JSON.stringify(token)}`);
  }
  const skipIndex = () => index++;

  let regexp = "";

  if(split.length <= 0) {
    throw new Error("can't compile empty string")
  }

  console.log(split);
  while (index < split.length) {
    let token = split[index];
    
    if(token === "") {
      index++;
      continue;
    }

    switch(token.type) {
      case "expression":
        switch(token.value) {
          case "FOR":
            let name = split[index - 1];

            checkType("FOR", "string", name);
            checkToken("FOR", {type: "group", value: "["}, split[++index]);

            openSquareBracket++;

            regexp += `(?<${name.value}>`;
            break;
          case "REPEAT":
            let amount = split[++index];
            checkToken("REPEAT", {type: "group", value: "("}, split[++index]);
            let token = split[++index];
            checkToken("REPEAT", {type: "group", value: ")"}, split[++index]);

            if(amount.type != "number" || token.type != "string") {
              throw new Error(`Illegal type for REPEAT at: ${index}`);
            }

            console.log(amount, token);
            let isNamed = split[index - 3].type === "group" && split[index - 3].value === ">";
            regexp += `(${isNamed ? "" : "("}${escapePattern(token.value)}){${amount.value}}${isNamed ? "" : ")"}`;
            break;
          default:
            throw new Error(`Unknown expression at: ${index}: '${JSON.stringify(token)}'`);
        }
        break;
      case "group":
        switch(token.value) {
          case "[":
            regexp += "(";
            openSquareBracket++;
            break;
          case "]":
            regexp += ")";
            openSquareBracket--;
            break;
          case "(":
            regexp += "(";
            openParentheses++;
            break;
          case ")":
            regexp += ")";
            openParentheses--;
            break;
          case "<":
            regexp += "<";
            openAngleBrackets++;
            break;
          case ">":
            regexp += ">";
            openAngleBrackets--;
          default:
            throw new Error(`Unknown group type at: ${index} | '${JSON.stringify(token)}'`);
        }
        break;
      case "string":
        // TODO: Implement string
        break;
      case "number":
        // TODO: Implement number
        break;
        default:
        throw new Error(`Unknown token type at: ${index} | '${JSON.stringify(token)}'`);
    }
    index++;
  }

  if(!(openAngleBrackets <= 0 || openParentheses <= 0 || openSquareBracket <= 0)) {
    console.log(openAngleBrackets, openParentheses, openSquareBracket);
    throw new Error("SRL detected a unterminated bracket!");
  }

  return new RegExp(regexp);
}

console.log(code, input);
console.log(check(code, input));