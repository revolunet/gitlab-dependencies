# gitlab-dependencies

Extract your project dependencies using GitLab API.

Supports :
 - `package.json` natively
 - `pom.xml` with [node-pom-parser](https://github.com/intuit/node-pom-parser)
 - `Gemfile.lock` with [gemfile](https://github.com/treycordova/gemfile)

The package returns parsed dependencies for *every* file that match this list.

`npm i gitlab-dependencies`

## Usage

```js

const gitlabDeps = require('gitlab-dependencies');

const dependencies = await gitlabDeps.get({
  gitlabUrl: "http://framagit.org",
  gitlabToken: "zlkfnzlnzmlfkzenfùzlknfùz",
  projectId: "gitlab-com/gitlab-profiler"
});

console.log(dependencies);

```