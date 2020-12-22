const ws = require('./services/ws');
const DevicesService = require('./services/devices');
const mqtt = require('./services/mqtt');
const logger = require('./services/logger')('MAIN');
const WidgetService = require('./services/widgets');
const config = require('../config');


process.on('beforeExit', () => {
  logger.i('closing connections...');
  mqtt.end();
  ws.end();
});

process.on('uncaughtExceptionMonitor', (ex) => {
  logger.e(ex.message);
});
