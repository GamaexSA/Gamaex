process.env.NODE_PATH = require('path').join(process.env.HOME || '/home/inversioneslf', 'nodevenv/gamaex-api/22/lib/node_modules');
require('module').Module._initPaths();
require('./dist/main');
