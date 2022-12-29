/** Devices management service
 * 
 * 
 * Thi service taps onto the eventBus and handles the addition and removal of devices
 * as well as emiting notifications when a new device is added or it's state changes
 * 
 * Devices are not persisted on disk.
 * 
 * 
 */
/* eslint-disable max-classes-per-file */
const fetch = require('node-fetch');
const logger = require('../logger')('DEVICES_SV');
const config = require('../../../config');
const EVS = require('../../events.js');
const { timedPromise } = require('../../utils');
const eventBus = require('../../eventBus');

class DevicesService {

  constructor() {
    this.store = new Map();
    this.init();

    if (config.mockDevices) {
      setTimeout(() => {
        require('./mocks').get(3).forEach(i => {
          this.store.set(i.device_id, i);
        });
        this.notifyUpdate();
      }, 5000);

    }
    if (config.scanAtStartup) this.scan();
  }

  init() {
    eventBus.addListener(EVS.DEVICES.SCAN, async () => {
      await this.scan();
      this.notifyUpdate();
    });

    eventBus.addListener(EVS.DEVICES.CMD, async (msg) => {
      logger.d('Relaying message', msg.payload, `to topics [${msg.topics.join(', ')}]`);
      msg.topics.forEach(topic => {
        const payload = (msg.data !== undefined && msg.data !== null)
          ? msg.payload.replace('$1', `"${msg.data}"`)
          : msg.payload;

        eventBus.emit(EVS.MQTT.PUBLISH, {
          topic,
          payload,
        });
      });
    });

    eventBus.addListener(EVS.DEVICES.LIST, async (client) => {
      logger.d('Requested device list');
      this.notifyUpdate(client);
    });

    eventBus.addListener(EVS.DEVICES.ANNOUNCE, async (payload) => {
      try {
        const msg = JSON.parse(payload.toString());
        switch (msg.ev) {
          case 'stateChange':
            this.updateState(msg.id,
              {
                spd: msg.spd,
                fx: msg.fx,
                br: msg.br,
                size: msg.size,
                mode: msg.mode
              });
            break;
          case 'birth':
            const data = await this.queryDevice(msg.ip);
            logger.i(data);
            this.add(data);
            break;
          case 'death':
            await this.remove(msg.id);
            break;
          default:
            throw new Error(`Unexpected message event ${msg.ev}`);
        }
      } catch (e) {
        logger.e(e);
      }
    });
  }

  notifyUpdate(client = null) {
    logger.d('Notifying devices store change');
    eventBus.emit(EVS.DEVICES.UPDATE, { client, data: Array.from(this.store.values()) });
  }

  isValidInfo(info) {
    return (
      info.topic !== undefined
      && info.human_name !== undefined
      && info.device_id !== undefined
    );
  }

  remove(id) {
    if (this.store.has(id)) {
      this.store.delete(id);
      this.notifyUpdate();
    } else {
      logger.w(`Attempted to remove non registered device ${id}`);
    }
  }

  updateState(id, state) {
    if (this.store.has(id)) {
      const d = this.store.get(id);
      d.state = state;
      this.notifyUpdate();
    } else {
      logger.d(Array.from(this.store));
      logger.w(`Received state update from non registered device: ${id}`);
    }
  }

  add(...devices) {
    devices.forEach(d => this.store.set(d.device_id, d));
    this.notifyUpdate();
  }

  async scan() {
    const { baseScanAddress, scanBatchSize, scanTimeout } = config;

    const ips = [];
    const data = [];
    for (let i = 1; i < 255; i++) {
      ips.push(`${baseScanAddress}${i}`);

      if (i % scanBatchSize === 0) {
        logger.i(`Scanning ips in range (${baseScanAddress}${i - scanBatchSize}, ${baseScanAddress}${i})`);
        await Promise.all(ips.map(async (ip) => {
          try {
            await timedPromise((async () => {
              const d = await this.queryDevice(ip);
              if (d) data.push(d);
            })(), scanTimeout);
          } catch (ex) {
            if (ex.code !== 'TIMEOUT') {
              logger.w(ex.toString());
            } else {
              logger.w(`Info request from ${ip} timed out`);
            }
          }
        }));
        ips.splice(0);
      }
    }
    this.add(...data);
  }

  /** Retrieves info json and state from a given ip address 
   *
   * @param ip  the ip address
  */
  async queryDevice(ip) {
    try {
      const infoAddr = `http://${ip}/info`;
      const stateAddr = `http://${ip}/state`;

      const res = await fetch(infoAddr);
      const obj = await res.json();
      if (this.isValidInfo(obj)) {
        const state = await fetch(stateAddr);
        return { ...obj, ...{ state: await state.json() } };
      } else {
        logger.i(`Found device at ip ${ip} with invalid info json`, obj);
      }
    } catch (err) {
      if (err.code !== 'EHOSTUNREACH' && err.code !== 'ECONNREFUSED' && err.code !== 'ETIMEDOUT') {
        logger.w(err.toString());
      }
    }
  }

}



module.exports = new DevicesService();