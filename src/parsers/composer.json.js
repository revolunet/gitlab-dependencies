module.exports = composerContent => Promise.resolve({ dependencies: JSON.parse(composerContent).require });
