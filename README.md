# gitlab-dependencies

Extract all your project dependencies using GitLab API.

Supports :

 - `package.json` natively
 - `composer.json` natively
 - `pom.xml` with [node-pom-parser](https://github.com/intuit/node-pom-parser)
 - `Gemfile.lock` with [gemfile](https://github.com/treycordova/gemfile)

The package returns parsed dependencies for **every file in the repo** that match this list.

## Install

`npm i gitlab-dependencies`

## Usage

```js

const gitlabDeps = require('gitlab-dependencies');

const dependencies = await gitlabDeps.get({
//  gitlabUrl: "http://framagit.org",
  gitlabToken: "zlkfnzlnzmlfkzenfùzlknfùz",
  projectId: "pages/jigsaw"
});

```

Return all matched files in the `pages/jigsaw` repo, with dependencies

```json
 [
  {
    "id": "945f18bf0d7720820391be895057754d68c02a17",
    "name": "package.json",
    "type": "blob",
    "path": "package.json",
    "mode": "100644",
    "dependencies": {
      "bootstrap": "4.0.0-alpha.6",
      "gulp": "^3.8.8",
      "hasbin": "^1.2.3",
      "laravel-elixir": "^6.0.0-15",
      "laravel-elixir-browsersync-official": "^1.0.0",
      "yargs": "^4.6.0"
    }
  },
  {
    "id": "a4577ce84f713d30bf1abaf66fe4491c6bdb9ffd",
    "name": "composer.json",
    "type": "blob",
    "path": "composer.json",
    "mode": "100644",
    "dependencies": {
      "tightenco/jigsaw": "^0.6.4"
    }
  }
]
```