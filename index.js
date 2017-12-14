var gitlab = require("gitlab");
var pomParser = require("pom-parser");

var api = (gitlabApi = gitlab({
  url: "http://gitlab.com",
  token: process.env.GITLAB_TOKEN
}));

const isPomXml = fileName => fileName.toLowerCase() === "pom.xml";
const isPackageJson = fileName => fileName.toLowerCase() === "package.json";

//
// scan given projectId
// projectId: myProjectName or gitlab-ce/gitlab
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
          resolve({
            "pom.xml": data.filter(x => isPomXml(x.name)),
            "package.json": data.filter(x => isPackageJson(x.name))
          });
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

const getNpmDependencies = pkgContent =>
  new Promise((resolve, reject) => {
    const pkg = JSON.parse(pkgContent);
    resolve({
      ...pkg.dependencies,
      ...pkg.devDependencies,
      ...pkg.peerDependencies
    });
  });

const getPomDependencies = pomContent =>
  new Promise((resolve, reject) => {
    pomParser.parse({ xmlContent: pomContent }, (err, pomResponse) => {
      if (err) {
        reject();
      }
      resolve(pomResponse.pomObject.project.dependencies.dependency);
    });
  });

const getRepoPackages = async (api, projectId) => {
  const readProjectFile = p => readFile({ api, projectId, path: p.path });

  const addDependencies = parse => p =>
    readProjectFile(p)
      .then(parse)
      .then(dependencies => ({
        ...p,
        dependencies
      }));

  // scan the repo, parse dependencies, and return all results
  return await scanRepo(api, projectId).then(packages => {
    const pomPackages = packages["pom.xml"].map(addDependencies(getPomDependencies));
    const npmPackages = packages["package.json"].map(addDependencies(getNpmDependencies));
    return Promise.all([...pomPackages, ...npmPackages]);
  });
};

const main = async () => {
  const projectPackages = await getRepoPackages(api, "non.est.sacra/zoomba");
  console.log(JSON.stringify(projectPackages, null, 2));

  const projectPackages2 = await getRepoPackages(api, "Rich-Harris/buble");
  console.log(JSON.stringify(projectPackages2, null, 2));
};

if (require.main === module) {
  main();
}
