global.config = Object.freeze(require('../config'));
global.logger = Object.freeze(require('simple-fancy-logger')({ logString: '[TSTAMP] [LEVEL] [TEXT]' }));

const ws = require('./services/ws');
const mqtt = require('./services/mqtt');

const { devices, sensors } = require('./models');

// sensor.loadData();
// devices.scan();

process.on('beforeExit', () => {
  global.logger.i('closing connections...');
  mqtt.end();
  ws.end();
});

process.on('uncaughtExceptionMonitor', (ex) => {
  global.logger.e(ex.message);
});
