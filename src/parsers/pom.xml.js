var pomParser = require("pom-parser");

module.exports = pomContent =>
  new Promise((resolve, reject) => {
    pomParser.parse({ xmlContent: pomContent }, (err, pomResponse) => {
      if (err) {
        reject();
      }
      resolve({ dependencies: pomResponse.pomObject.project.dependencies.dependency });
    });
  });
