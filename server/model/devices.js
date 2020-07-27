/* eslint-disable max-classes-per-file */
const fetch = require('node-fetch');
const { inspect } = require('util');
const ObservableList = require('./observableList');
const { wait } = require('../utils');

const { logger, config } = global;

class Devices {
  constructor() {
    this.data = new ObservableList((list) => this.update(list));
    this.scanBatchSize = 24;
    this.scanTimeout = 2000;
  }

  update(list) {
    console.log('Devices list updated');
    console.log(inspect(list));
  }

  get(id) {
    return this.data.find((device) => id === device.device_id);
  }

  async getInfo(ip) {
    try {
      const addr = `http://${ip}/info`;
      const res = await fetch(addr);
      const obj = [{ ip, info: await res.json() }];
      this.data.addItems(obj);
    } catch (err) {
      if (err.code !== 'EHOSTUNREACH' && err.code !== 'ECONNREFUSED') { logger.w(err); }
    }
  }

  async scan() {
    const { baseScanAddress } = config;
    for (let i = 1; i < 255; i++) {
      this.getInfo(`${baseScanAddress}${i}`);
      if ((i % this.scanBatchSize) === 0) {
        logger.i(`Scanning ips in range (${baseScanAddress}${i - this.scanBatchSize}, ${baseScanAddress}${i})`);
        await wait(this.scanTimeout);
      }
    }
  }
}

module.exports = new Devices();
