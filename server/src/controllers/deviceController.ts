import { Devices } from '../services/db';
import { deviceData, deviceStateData } from '../types';
import { getTaggedLogger } from '../services/logger';
import { timedPromise } from '../utils';
import config from '../../config';
import fetch from 'node-fetch';
import { v4 as uuid } from 'uuid';
import { getClient as getMQTTClient } from '../services/mqtt'
import { send } from '../services/ws';

const logger = getTaggedLogger('DeviceCTRL');
let scanning = false;


export function isScanning(): boolean {
  return scanning;
}

function getMockDev(): deviceData {
  const br = 5 + Math.ceil(Math.random() * 80);
  const spd = 5 + Math.ceil(Math.random() * 80);
  const length = 5 + Math.ceil(Math.random() * 100);

  return {
    ssid: 'Brothel Misa',
    ap_ssid: 'tv bar',
    human_name: `Mock device ${uuid()}}`,
    announce_topic: 'announce',
    device_id: `mok_dev${uuid()}`,
    broker: '192.168.1.10',
    topic: 'mock/topic',
    build: 'v0.1.42 - 2020-10-31 19:36:47.426951',
    use_mqtt: true,
    strip_size: length,
    ip: `192.168.1.${10 + Math.ceil(Math.random() * 50)}`,
    state: { "br": br, "spd": spd, "fx": 2, "mode": 2, "size": length }
  }
}

export async function scan() {
  if (scanning) {
    logger.warn('scanning already in progress');
    return;
  }
  const { baseScanAddress, scanBatchSize, scanTimeout } = config;
  let spawnedFuncs = 0;
  const queries = [];
  
  send('DEVICES.')
  
  scanning = true;

  for (let i = 1; i < 255; i++) {
    const ip = `${baseScanAddress}${i}`;

    const fn = async () => {
      try {
        const d = await queryDevice(ip);
        return d as deviceData;
      } catch (ex) {
        logger.warn(ex);
        return null;
      }
    };

    queries.push(
      timedPromise<deviceData | null>(fn(), scanTimeout)
        .catch(ex => { if (ex.message !== 'Timed out') logger.warn(ex.message) })
        .finally(() => spawnedFuncs--)
    );

    spawnedFuncs++;

    if (spawnedFuncs >= scanBatchSize)
      await Promise.any(queries);

  }

  const data = (await Promise.all(queries)).filter(d => d !== null && d !== undefined);
  Devices.addBatch(data.map(v => [v!.device_id, v!]));
  scanning = false;
}

export function add(device: deviceData) {
  logger.warn('Add device function not implemented');
}

export async function handleAnnouncement(payload: string) {
  logger.debug(payload);
  try {
    const msg = JSON.parse(payload);
    switch (msg.ev) {
      case 'stateChange':
        updateState(msg.id,
          {
            spd: msg.spd,
            fx: msg.fx,
            br: msg.br,
            size: msg.size,
            mode: msg.mode
          });
        break;
      case 'birth':
        const data = await queryDevice(msg.ip);
        logger.info(data);
        if (data !== null) Devices.add(data.device_id, data);
        break;
      case 'death':
        await del(msg.id);
        break;
      default:
        throw new Error(`Unexpected message event ${msg.ev}`);
    }
  } catch (e) {
    logger.error(e);
  }
}

export async function issueCMD(deviceIds: string[], payload: string) {
  deviceIds.map(id => Devices.get(id).topic).forEach(topic => {
    logger.info(`Emitting ${payload} to ${topic}`);
    getMQTTClient().publish(topic, payload);
  });
}

function validateDevInfo(info: deviceData): boolean {
  return (
    info.topic !== undefined
    && info.human_name !== undefined
    && info.device_id !== undefined
  );
};

async function queryDevice(ipAddr: string): Promise<deviceData | null> {
  try {
    const infoAddr = `http://${ipAddr}/info`;
    const stateAddr = `http://${ipAddr}/state`;

    const res = await (await fetch(infoAddr)).json();
    if (validateDevInfo(res)) {
      const state = await (await fetch(stateAddr)).json();

      return {
        ...res,
        ...{ state: await state },
        stateString: JSON.stringify(state),
        infoString: JSON.stringify(res)
      } as deviceData;

    } else {
      logger.warn(`Found device at ip ${ipAddr} with invalid info json`);
    }
  } catch (err: any) {
    if (!['EHOSTUNREACH', 'ECONNREFUSED', 'ETIMEDOUT'].includes(`${err.code}`) && err.type !== 'invalid-json') {
      logger.warn(err);
    }
  }

  return null;
}

function updateState(id: string, state: deviceStateData) {
  try {
    const dev = Devices.get(id);
    if (dev === null) throw new Error(`Device with id ${id} not found`);
    dev.state = state;
    Devices.add(id, dev);
  } catch (e) {
    logger.error(`Error updating state of device ${id} state:`, state);
    logger.error(e);
  }
}

export function del(deviceId: string) {
  if (Devices.exists(deviceId)) {
    Devices.del(deviceId);
  } else {
    logger.warn(`Attempted to remove non registered device ${deviceId}`);
  }
}

export function get(deviceId: string): deviceData {
  return Devices.get(deviceId);
}

export function getAll(): deviceData[] {
  return Devices.getAll().map(d => d[1]);
}

if (config.scanAtStartup) scan();

if (config.mockDevices && false) {
  setTimeout(() => {
    const mockdevs: [string, deviceData][] = [];
    for (let i = 0; i < 3; i++) {
      const d = getMockDev();
      mockdevs.push([d.device_id, d]);
    }

    Devices.addBatch(mockdevs);
  }, 3000);
}
