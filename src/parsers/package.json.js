module.exports = pkgContent =>
  new Promise((resolve, reject) => {
    const pkg = JSON.parse(pkgContent);
    resolve({
      dependencies: pkg.dependencies,
      devDependencies: pkg.devDependencies,
      peerDependencies: pkg.peerDependencies
    });
  });
