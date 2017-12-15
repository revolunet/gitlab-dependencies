var gitlab = require("gitlab");

// available parsers and expected files
const parsers = {
  "package.json": require("./parsers/package.json.js"),
  "pom.xml": require("./parsers/pom.xml.js"),
  "Gemfile.lock": require("./parsers/Gemfile.lock.js"),
  "composer.json": require("./parsers/composer.json.js")
};

//
// scan given projectId for parsers-ready files
// projectId: myProjectName or gitlab-ce/gitlab
// for each parser file, return a list of found files
//
const scanRepo = (api, projectId) =>
  new Promise((resolve, reject) => {
    api.projects.repository.listTree(
      projectId,
      {
        recursive: true,
        ref: "master"
      },
      data => {
        if (data) {
          // scan the repo, parse dependencies, and return all results
          const fileNames = Object.keys(parsers);
          resolve(
            fileNames.map(fileName => data.filter(x => x.name === fileName)).reduce(
              (a, c, i) => ({
                ...a,
                [fileNames[i]]: c
              }),
              {}
            )
          );
          return;
        }
        reject();
      }
    );
  });

//
// read file contents from gitlab API
//
const readFile = ({ api, projectId, path, ref = "master" }) =>
  new Promise((resolve, reject) => {
    api.projects.repository.showFile(
      {
        projectId,
        ref,
        file_path: path
      },
      file => {
        if (file) {
          resolve(new Buffer(file.content, "base64").toString());
        }
        reject();
      }
    );
  });

const getProjectPackages = async (api, projectId) => {
  const readProjectFile = p => readFile({ api, projectId, path: p.path });

  // parse dependencies file and add a dependencies key to gien `p` hash
  const addDependencies = parse => p =>
    readProjectFile(p)
      .then(parse)
      .then(dependencies => ({
        ...p,
        dependencies
      }));

  // scan the repo, parse dependencies, and return all results
  return await scanRepo(api, projectId).then(files => {
    const allFiles = Object.keys(files)
      .filter(fileName => files[fileName].length)
      // apply correct parser to specific files and add dependency key to given payload
      .map(fileName => Promise.all(files[fileName].map(addDependencies(parsers[fileName]))));
    // wait for everything to be parsed then flatten all results
    return Promise.all(allFiles).then(results => results.reduce((a, c) => [...a, ...c], []));
  });
};

// entry point
const getProjectDependencies = ({ gitlabToken, gitlabUrl = "http://gitlab.com", projectId }) => {
  const api = gitlab({
    url: gitlabUrl,
    token: gitlabToken
  });
  return getProjectPackages(api, projectId);
};

module.exports = getProjectDependencies;

// demo
const main = async () => {
  const TOKEN = process.env.GITLAB_TOKEN;
  const projects = ["non.est.sacra/zoomba", "Rich-Harris/buble", "gitlab-com/gitlab-profiler", "pages/jigsaw"];
  projects.forEach(async projectId => {
    const projectPackages = await getProjectDependencies({
      gitlabToken: TOKEN,
      projectId
    });
    console.log(projectId, "\n\n", JSON.stringify(projectPackages, null, 2), "\n\n");
  });
};
s: if (require.main === module) {
  main();
}
