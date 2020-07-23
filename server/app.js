global.logger = Object.freeze(require('simple-fancy-logger')({ logString: '[TSTAMP] [LEVEL] [TEXT]' }));
global.config = Object.freeze(require('./config'));

const ws = require('./services/ws');
const mqtt = require('./services/mqtt');

process.on('beforeExit', () => {
  global.logger.i('closing connections...');
  // mqtt.end();
  // wsServer.end();
});
