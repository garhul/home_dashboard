const path = require('path');
const { broadcast } = require('../ws');
const evs = require('../ws/events');

const { config, logger } = global;
const devices = {};

const handler = {
  set(obj, prop, value) {
    logger.i(`New device ${value.device_id} added `);
    broadcast(evs.DEVICE_UPDATE, value);
    return Reflect.set(...arguments);
  },
};

const proxiedDevices = new Proxy(devices, handler);

exports.add = (device) => {
  proxiedDevices[device.device_id] = device;
};

exports.get = (id) => proxiedDevices[id];

exports.getAll = () => proxiedDevices;
