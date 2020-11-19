const { inspect } = require('util');
const groupsData = require('../../data/groups');
const logger = require('../services/logger');
const eventBus = require('../eventBus');

const TAG = 'GROUPS_HANDLER';
const store = new Map();

groupsData.forEach(v => store.set(v.id, v));

eventBus.addListener(eventBus.EVS.GROUPS.LIST, (client) => {
  logger.d('Requested groups list', TAG);
  eventBus.emit(eventBus.EVS.GROUPS.UPDATE, { client, data: Array.from(store) });
});

eventBus.addListener(eventBus.EVS.GROUPS.CMD, (data) => {
  logger.d(`Received groups command , ${inspect(data)}`, TAG);

  const st = store.get(data.id);
  logger.d(`Relaying payload to topics ${st.topics.join(',')}`);

  // TODO:: fix stuff here
  st.topics.forEach(topic => {
    eventBus.emit(eventBus.EVS.DEVICES.CMD, {
      topic,
      cmd: data.cmd,
      payload: data.payload,
    });
  });
});
