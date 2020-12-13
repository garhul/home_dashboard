const eventBus = require('./eventBus');
const ws = require('./services/ws');
const DevicesService = require('./services/devices');
const mqtt = require('./services/mqtt');
const logger = require('./services/logger');
const GroupsService = require('./services/groups');


const devices = new DevicesService(eventBus);
const groups = new GroupsService(eventBus);


process.on('beforeExit', () => {
  logger.i('closing connections...');
  mqtt.end();
  ws.end();
});

process.on('uncaughtExceptionMonitor', (ex) => {
  logger.e(ex.message);
});
