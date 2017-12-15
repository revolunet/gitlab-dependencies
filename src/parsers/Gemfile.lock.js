var gemParser = require("gemfile");

module.exports = gemContent => new Promise((resolve, reject) => resolve(gemParser.interpret(gemContent).DEPENDENCIES));
