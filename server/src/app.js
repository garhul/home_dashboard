const ws = require('./services/ws');
const mqtt = require('./services/mqtt');
const logger = require('./services/logger');
// eslint-disable-next-line no-unused-vars
const handlers = require('./handlers');

process.on('beforeExit', () => {
  logger.i('closing connections...');
  mqtt.end();
  ws.end();
});

process.on('uncaughtExceptionMonitor', (ex) => {
  logger.e(ex.message);
});
