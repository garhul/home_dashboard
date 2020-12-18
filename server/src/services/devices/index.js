/** Devices management service
 * 
 * 
 * Thi service taps onto the eventBus and handles the addition and removal of devices
 * as well as emiting notifications when a new device is added or it's state changes
 * 
 * Devices are not persisted in disk.
 * 
 * 
 */


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
    this.scan();
  }

  init() {
    this.bus.addListener(EVS.DEVICES.SCAN, async () => {
      await this.scan();
      this.notifyUpdate();
    });
    
    this.bus.addListener(EVS.DEVICES.CMD, async (msg) => {
      if (!msg.topics instanceof Array) msg.topcis = [msg.topcis];
      logger.d(`Relaying message [${msg.payload}] to topics [${msg.topics.join(', ')}]`);
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
    
    this.bus.addListener(EVS.DEVICES.ANNOUNCE, async (payload) => {
      try {
        const msg = JSON.parse(payload.toString());
        switch(msg.ev) {
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
            const data = await this.queryDevice()
            this.add(data);            
            break;
          case 'death':
            await this.remove(msg.id);
            
            break;
          default:
            throw new Error(`Unexpected message event ${msg.ev}`);
        }        
      } catch (e) {
        logger.e(e, TAG);
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

  remove(id) {
    if (this.store.has(id)) {
      this.store.delete(id);
      this.notifyUpdate();
    } else {
      logger.w(`Attempted to remove non registered device ${id}`, TAG);
    }
  }

  updateState(id, state) {
    if (this.store.has(id)) {
      const d = this.store.get(id);
      d.state = state;
      this.notifyUpdate();
    } else {
      logger.w(`Received state update from non registered device: ${id}`, TAG);
    }
  }

  add(...devices) {
    devices.forEach( d => this.store.set(d.device_id, d));
    this.notifyUpdate();
  }

  async scan() {
    const { baseScanAddress, scanBatchSize, scanTimeout } = config;
  
    const ips = [];
    const data = [];
    for (let i = 1; i < 255; i++) {
      ips.push(`${baseScanAddress}${i}`);
  
      if (i % scanBatchSize === 0) {
        logger.i(`Scanning ips in range (${baseScanAddress}${i - scanBatchSize}, ${baseScanAddress}${i})`, TAG);
        await Promise.all(ips.map(async (ip) => {
          try {
            
            await timedPromise((async () => {
              const d = await this.queryDevice(ip);
              if (d) data.push(d);             
            })(), scanTimeout);
          } catch (ex) {
            if (ex.code !== 'TIMEOUT') {
              logger.w(ex, TAG);
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
        return {...obj, ...{state: state.json()}};        
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