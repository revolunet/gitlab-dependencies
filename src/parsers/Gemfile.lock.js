var gemParser = require("gemfile");

module.exports = gemContent =>
  new Promise((resolve, reject) => resolve({ dependencies: gemParser.interpret(gemContent).DEPENDENCIES }));
