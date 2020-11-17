const config = require('../../config');
const mockData = require('../mocks/groups');
const logger = require('../services/logger');
const eventBus = require('../eventBus');

const TAG = 'GROUPS_HANDLER';
const store = new Map();

if (config.useMocks) {
  mockData.forEach(v => store.set(v.id, v));
}

eventBus.addListener(eventBus.EVS.GROUPS.LIST, (client) => {
  logger.d('Requested groups list', TAG);
  eventBus.emit(eventBus.EVS.GROUPS.UPDATE, { client, data: Array.from(store) });
});

eventBus.addListener(eventBus.EVS.GROUPS.CMD, (data) => {
  logger.d(`Received groups command , ${data}`, TAG);
});
