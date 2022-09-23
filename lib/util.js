const { inspect } = require("util");

const deepLog = (obj) => {
  console.log(
    inspect(obj, {
      depth: Infinity,
      colors: true,
    })
  );
};

module.exports = {
  deepLog,
};
