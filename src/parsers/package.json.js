module.exports = pkgContent =>
  new Promise((resolve, reject) => {
    const pkg = JSON.parse(pkgContent);
    resolve({
      ...pkg.dependencies,
      ...pkg.devDependencies,
      ...pkg.peerDependencies
    });
  });
