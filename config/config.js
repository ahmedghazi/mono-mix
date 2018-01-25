const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'monomix'
    },
    port: process.env.PORT || 3006,
    db: 'mongodb://localhost/monomix-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'monomix'
    },
    port: process.env.PORT || 3006,
    db: 'mongodb://localhost/monomix-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'monomix'
    },
    port: process.env.PORT || 3006,
    db: 'mongodb://localhost/monomix-production'
  }
};

module.exports = config[env];
