/* eslint-disable max-classes-per-file */
const { inspect } = require('util');
const fetch = require('node-fetch');
const logger = require('../services/logger');
const config = require('../../config');
const { wait } = require('../utils');
const eventBus = require('../eventBus');
const mockData = require('../mocks/devices');
const controls = require('../../data/deviceControls.js');

const store = new Map();
const logTag = 'DEVICES_HANDLER';

if (config.useMocks) {
  mockData.forEach(val => store.set(val.device_id, { ...val, controls }));
}

function notifyUpdate(client = null) {
  logger.d('Notifying devices store change', logTag);
  eventBus.emit(eventBus.EVS.DEVICES.UPDATE, { client, data: Array.from(store) });
}

/** Retrieves info json from a given ip address and stores it
 *  on the store and emits a devices update event
 *
 * @param ip  the ip address
*/
async function inscribe(ip) {
  try {
    const addr = `http://${ip}/info`;
    const res = await fetch(addr);
    const obj = [{ ip, info: await res.json() }];
    obj.controls = controls;
    store.set(obj.device_id, obj);
    eventBus.emit(eventBus.EVS.DEVICES.UPDATE, store);
  } catch (err) {
    if (err.code !== 'EHOSTUNREACH' && err.code !== 'ECONNREFUSED') {
      logger.w(err, logTag);
    }
  }
}

/** Scan network for devices, adds them to the db when done */
async function scan() {
  const { baseScanAddress } = config;
  for (let i = 1; i < 255; i++) {
    inscribe(`${baseScanAddress}${i}`);
    if (i % this.scanBatchSize === 0) {
      logger.i(`Scanning ips in range (${baseScanAddress}${i - this.scanBatchSize}, ${baseScanAddress}${i})`, logTag);
      await wait(this.scanTimeout);
    }
  }
}

eventBus.addListener(eventBus.EVS.DEVICES.SCAN, async () => {
  await scan();
  eventBus.emit(eventBus.EVS.DEVICES.UPDATE, Array.from(store));
});

eventBus.addListener(eventBus.EVS.DEVICES.CMD, async (msg) => {
  msg.topics.forEach(topic => {
    const payload = (msg.data !== undefined && msg.data !== null)
      ? msg.payload.replace('$1', `"${msg.data}"`)
      : msg.payload;

    eventBus.emit(eventBus.EVS.MQTT.PUBLISH, {
      topic,
      payload,
    });
  });
});

eventBus.addListener(eventBus.EVS.DEVICES.LIST, async (client) => {
  logger.d('Requested device list', logTag);
  notifyUpdate(client);
});

eventBus.addListener(eventBus.EVS.DEVICES.ANNOUNCE, async (msg) => {
  try {
    await inscribe(msg.toString().split('|')[1]);
  } catch (e) {
    logger.e(e);
  }
});
