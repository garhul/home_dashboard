/* eslint-disable max-classes-per-file */
const { EventEmitter } = require('events');
const fetch = require('node-fetch');
const { inspect } = require('util');
const ObservableList = require('../observableList');
const { wait } = require('../../utils');
const logger = require('../../services/logger');
const config = require('../../../config');
const mockData = require('./mock');

class Devices extends EventEmitter {
  constructor(data = null) {
    super();
    this.devicesList = new ObservableList((list) => this.update(list));
    if (data !== null) this.devicesList.set(data);
    this.scanBatchSize = 24;
    this.scanTimeout = 2000;
  }

  update(list) {
    this.emit('change');
    logger.i('Device list updatd');
    logger.d(inspect(list));
  }

  get(id) {
    return this.devicesList.find((device) => id === device.device_id);
  }

  getAll() {
    return this.devicesList.data;
  }

  async getInfo(ip) {
    try {
      const addr = `http://${ip}/info`;
      const res = await fetch(addr);
      const obj = [{ ip, info: await res.json() }];
      this.devicesList.addItems(obj);
    } catch (err) {
      if (err.code !== 'EHOSTUNREACH' && err.code !== 'ECONNREFUSED') {
        logger.w(err);
      }
    }
  }

  async scan() {
    const { baseScanAddress } = config;
    for (let i = 1; i < 255; i++) {
      this.getInfo(`${baseScanAddress}${i}`);
      if (i % this.scanBatchSize === 0) {
        logger.i(
          `Scanning ips in range (${baseScanAddress}${
            i - this.scanBatchSize
          }, ${baseScanAddress}${i})`,
        );
        await wait(this.scanTimeout);
      }
    }
  }
}

const useMock = true;

if (useMock) {
  logger.i('Using mock devices');
  module.exports = new Devices(mockData);
} else {
  module.exports = new Devices();
}
