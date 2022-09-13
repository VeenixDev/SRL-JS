let input = `tst.12345`
let code = `!lstart [ "abc" FOR [ REPEAT $3 (FROM ("tes") ) ] "." "numbers" FOR [ REPEAT $5 (!digit) ] ] OR [ LITERAL ("uwu") ] !lend GLOBAL MULTILINE`;

const STRING_LITERAL = "\"";

function printTokens(tokens) {
	for(let i in tokens) {
		console.log(`${i} | ${JSON.stringify(tokens[i])}`);
	}
}

function check(test, input) {
  let regexp = compileToRegExp(test);
  console.log(regexp);
  return regexp.test(input);
}

function tokenize(code) {
  let tokens = [];
  let index = 0;
  let lastToken = "";

  const GLOBAL_VARS = {
  	digit: "\\d",
  	nonDigit: "\\D",
  	whitespace: "\\s",
  	nonWhitespace: "\\S",
  	word: "\\w",
  	nonWord: "\\W",
  	verticalSpace: "\\v",
  	escape: "\\",
  	backspace: "[\\b]",
  	controlY: "\\cY",
  	octal: "\\ddd",
  	hex8: "\\xYY",
  	hex16: "\\uYYYY",
  	lstart: "^",
  	lend: "$"
  }
  const ESCAPE_SEQUENCES = Object.freeze(["n", "r", "t", "b", "\""]);
  const EXPRESSIONS = Object.freeze(["FOR", "REPEAT", "OR", "LITERAL", "FROM"]);
  const GROUPS = Object.freeze(["[", "]", "(", ")", "<", ">"]);
  const OPTIONS = Object.freeze(["GLOBAL", "MULTILINE", "INSENSITIVE", "STICKY", "UNICODE", "SINGLELINE", "INDICES"]);
  // TODO: Implement quantifiers
  const QUANTIFIERS = Object.freeze(["MORE", "LESS", "THAN", "COULD", "HAVE", "MULTIPLE", "EXACT", "GREEDY", "LAZY", "POSSESSIVE"]);

  const pushToken = (token, forceType) => {
  	if(!token) return;
  
  	if(forceType) {
  		tokens.push({type: "string", value: token});
  		lastToken = "";
  		return;
  	}
  
  	if(EXPRESSIONS.includes(token)) {
  		tokens.push({type: "expression", value: token});
  	} else if(GROUPS.includes(token)) {
  		tokens.push({type: "group", value: token});
  	} else if(OPTIONS.includes(token)) {
  		tokens.push({type: "option", value: token});
  	} else if(QUANTIFIERS.includes(token)) {
  		tokens.push({type: "quantifier", value: token});
  	} else {
  		if(token.startsWith("$")) {
  			tokens.push({type: "number", value: token.substring(1)});
  		} else if(token.startsWith("!")) {
  			let value = GLOBAL_VARS[token.substring(1)];
  			console.log("global", value, token.substring(1));
  			tokens.push({type: "string", value: value});
  		} else {
  			tokens.push({type: "unknown", value: token});
  		}
  	}
  	
    lastToken = "";
  }

  while(index < code.length) {
    if(code[index] === " ") {
      if(lastToken !== "") {
        pushToken(lastToken);
      }
    } else if(GROUPS.includes(code[index])) {
      if(lastToken !== "") {
      	pushToken(lastToken);
      }
      pushToken(code[index]);
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
          pushToken(stringLiteral, "string");
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
    pushToken(lastToken);
  }

  return tokens.filter((token) => token.value !== "");
}

function compileToRegExp(code) {
  let split = tokenize(code);
  let index = 0;
  let openParentheses = 0;
  let openSquareBracket = 0;
  let openAngleBrackets = 0;
  let lastTokenLength = 0;
  let options = [];

  const OPTIONS_MAP = {
  	GLOBAL: "g",
  	MULTILINE: "m",
  	INSENSITIVE: "i",
  	STICKY: "y",
  	UNICODE: "u",
  	SINGLELINE: "s",
  	INDICES: "d"
  };
  const escapePattern = (token) => {
    return token.replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(/"/g, "\\\"").replace(/\./g, "\\.");
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
    throw new Error(`Illegal token for ${expression} at: ${index} | Expected ${JSON.stringify(expected)} got ${JSON.stringify(token)}`);
  }
  const addOption = (token) => {
  	for(let option of options) {
  		if(option.value === token.value) {
  			throw new Error(`Duplicate option at: ${index} | '${token.value}'`);
  		}
  	}
  	
  	options.push(token);
  }
  const skipIndex = () => index++;

  let regexp = "";

  if(split.length <= 0) {
    throw new Error("can't compile empty string")
  }
  const handleToken = (token) => {    
    if(token === "") {
      index++;
      return;
    }
	let preLength = regexp.length;
    switch(token.type) {
      case "expression":
        switch(token.value) {
          case "FOR":
            let name = split[index - 1];

            checkType("FOR", "string", name);
            checkToken("FOR", {type: "group", value: "["}, split[++index]);

            openSquareBracket++;
			regexp = regexp.substring(0, regexp.length - lastTokenLength);
            regexp += `(?<${name.value}>`;
            break;
          case "REPEAT":
            let amount = split[++index];
            
            checkToken("REPEAT", {type: "group", value: "("}, split[++index]);
            
            let token = split[++index];
            let repeatsExpression = false;
            
            if(token.type === "expression") {
            	handleToken(token);
				repeatsExpression = true;
            } else {
            	regexp += escapePattern(token.value);
            }
            checkToken("REPEAT", {type: "group", value: ")"}, split[++index]);


            if(amount.type != "number") {
              throw new Error(`Illegal type for REPEAT at: ${index} | Expected number or string, got ${JSON.stringify(token)}`);
            }

            let isNamed = split[index - 3].type === "group" && split[index - 3].value === ">";
            regexp += `{${amount.value}}`;
            break;
          case "OR":
          	regexp += "|";
          	break;
          case "LITERAL":
          	checkToken("LITERAL", {type: "group", value: "("}, split[++index]);
          	let lit = split[++index];
          	checkToken("LITERAL", {type: "group", value: ")"}, split[index]);
          	
          	checkType("LITERAL", "string", lit);
          	
          	regexp += escapePattern(lit.value);
          	break;
          case "FROM":
            checkToken("FROM", {type: "group", value: "("}, split[++index]);
            let group = split[++index];
            checkType("FROM", "string", group);
            checkToken("FROM", {type: "group", value: ")"}, split[++index]);
            regexp += `[${escapePattern(group.value)}]`;
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
            break;
          default:
            throw new Error(`Unknown group type at: ${index} | '${JSON.stringify(token)}'`);
        }
        break;
      case "quantifier":
      	// Object.freeze(["MORE", "LESS", "THAN", "COULD", "HAVE", "MULTIPLE", "EXACT", "GREEDY", "LAZY", "POSSESSIVE"]);
      	switch (token.value) {
      		case "MORE":
      			checkToken("MORE", {type: "quantifier", value: "THAN"});
      			
      	}
      	break;
      case "string":
      	regexp += escapePattern(split[index].value);
        break;
      case "number":
        // TODO: Implement number
        break;
      case "option":
      	addOption(split[index]);
      	break;
      default:
        throw new Error(`Unknown token type at: ${index} | '${JSON.stringify(token)}'`);
    }
    lastTokenLength = regexp.length - preLength;
  }
  printTokens(split);
  while (index < split.length) {
    handleToken(split[index]);
    index++;
  }

  if(!(openAngleBrackets === 0 && openParentheses === 0 && openSquareBracket === 0)) {
    throw new Error("SRL detected a unterminated bracket!");
  }
  let regexpOptions = "";
  
  for(let option of options) {
  	regexpOptions += OPTIONS_MAP[option.value];
  }
  
  return new RegExp(regexp, regexpOptions);
}

console.log(code, " | ", input);
console.log(check(code, input));

