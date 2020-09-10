const ws = require('./services/ws');
const mqtt = require('./services/mqtt');
const logger = require('./services/logger');

const { devices, sensors } = require('./models');

// sensor.loadData();
// devices.scan();

process.on('beforeExit', () => {
  logger.i('closing connections...');
  mqtt.end();
  ws.end();
});

process.on('uncaughtExceptionMonitor', (ex) => {
  logger.e(ex.message);
});
