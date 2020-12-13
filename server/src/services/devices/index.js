/* eslint-disable max-classes-per-file */
const fetch = require('node-fetch');
const logger = require('../logger');
const config = require('../../../config');
const mockData = require('../../../data/mocks/devices');
const EVS = require('../../events.js');
const { aurora } = require('../../../data/controls');
const { timedPromise } = require('../../utils');

const TAG = 'DEVICES_SV';

class Devices {

  constructor(bus) {
    this.store = new Map();
    this.bus = bus;
    if (config.useMocks) {
      mockData.forEach(val => this.store.set(val.device_id, { ...val, controls: aurora }));
    }
    this.init();
  }

  init() {
    this.bus.addListener(EVS.DEVICES.SCAN, async () => {
      await this.scan();
      this.notifyUpdate();
    });
    
    this.bus.addListener(EVS.DEVICES.CMD, async (msg) => {
      if (!msg.topics instanceof Array) msg.topcis = [msg.topcis];
      logger.i(`Relaying message [${msg.payload}] to topics [${msg.topics.join(', ')}]`);
      console.log(msg.topics);
      msg.topics.forEach(topic => {
        const payload = (msg.data !== undefined && msg.data !== null)
          ? msg.payload.replace('$1', `"${msg.data}"`)
          : msg.payload;
    
        this.bus.emit(EVS.MQTT.PUBLISH, {
          topic,
          payload,
        });
      });
    });
    
    this.bus.addListener(EVS.DEVICES.LIST, async (client) => {
      logger.d('Requested device list', TAG);
      this.notifyUpdate(client);
    });
    
    this.bus.addListener(EVS.DEVICES.ANNOUNCE, async (msg) => {
      try {
        await this.inscribe(msg.toString().split('|')[1]);
        this.notifyUpdate();
      } catch (e) {
        logger.e(e);
      }
    });
    
  }

  notifyUpdate(client = null) {
    logger.d('Notifying devices store change', TAG);
    this.bus.emit(EVS.DEVICES.UPDATE, { client, data: Array.from(this.store.values()) });
  }

  isValidInfo(info) {
    return (
      info.topic !== undefined
      && info.human_name !== undefined
      && info.device_id !== undefined
    );
  }

  async scan() {
    const { baseScanAddress, scanBatchSize, scanTimeout } = config;
  
    const ips = [];
    for (let i = 1; i < 255; i++) {
      ips.push(`${baseScanAddress}${i}`);
  
      if (i % scanBatchSize === 0) {
        logger.i(`Scanning ips in range (${baseScanAddress}${i - scanBatchSize}, ${baseScanAddress}${i})`, TAG);
        await Promise.all(ips.map(async (ip) => {
          try {
            await timedPromise(this.inscribe(ip), scanTimeout);
          } catch (ex) {
            if (ex.code !== 'TIMEOUT') {
              logger.w(ex, TAG);
            }
          }
        }));
        ips.splice(0);
      }
    }
  }
  
  /** Retrieves info json from a given ip address and stores it
   *  on the store and emits a devices update event
   *
   * @param ip  the ip address
  */
  async inscribe(ip) {
    try {
      const addr = `http://${ip}/info`;
      const res = await fetch(addr);
      const obj = { ...(await res.json()), controls: aurora };
      if (this.isValidInfo(obj)) {
        this.store.set(obj.device_id, obj);
      } else {
        logger.i(`Found device at ip ${ip} with invalid info json ${obj}`);
      }
    } catch (err) {
      if (err.code !== 'EHOSTUNREACH' && err.code !== 'ECONNREFUSED' && err.code !== 'ETIMEDOUT') {
        logger.w(err, TAG);
      }
    }
  }

}

module.exports = Devices;