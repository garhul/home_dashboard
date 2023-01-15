import config from '../config';
import { getClient, MQTTHandler } from './services/mqtt';
import { timedPromise } from './utils/';
import { DeviceController, SensorController } from './controllers';
import * as WebSocketServer from './services/ws';
import { Devices } from './services/db';
import { getTaggedLogger } from './services/logger';
const logger = getTaggedLogger('EV_DISPATCHER');
/*** Unify websockets and MQTT events to interact with entities */


const handlers: MQTTHandler[] = [
  {
    topic: config.mqtt.announceTopic,
    fn: (_topic: string, payload: string) => {
      DeviceController.handleAnnouncement(payload);
    }
  },
  {
    topic: config.mqtt.sensorsTopic,
    fn: (_toppic: string, payload: string) => {
      SensorController.addData(payload);
    },
  }
];

const mqttClient = getClient(handlers);


WebSocketServer.init();

Devices.onChange((devices) => {
  WebSocketServer.send(null, { ev: 'DEVICES_UPDATE', data: devices.map(d => d[1]) });
});


export async function closeConnections() {
  return timedPromise(new Promise((res, _rej) => {
    WebSocketServer.close();

    mqttClient.end(false, res);
  }), 5000);
}