import config from '../config';
import { init as mqttInit, MQTTHandler } from './services/mqtt';
import { timedPromise } from './utils/';
import { DeviceController, SensorController } from './controllers';
import * as WebSocketServer from './services/ws';
import { Devices } from './services/db';
/*** Unify websockets and MQTT events to interact with entities */

const mqttClient = mqttInit([
  {
    topic: config.mqtt.announceTopic,
    fn: (_t, payload) => {
      DeviceController.handleAnnouncement(payload)
    }
  },
  {
    topic: config.mqtt.sensorsTopic,
    fn: (_t, payload) => {
      SensorController.addData(payload);
    },
  }
]);

WebSocketServer.init();

Devices.onChange((devices) => {
  WebSocketServer.send(null, { ev: 'DEVICES_UPDATE', data: devices });
});


export async function closeConnections() {
  return timedPromise(new Promise((res, _rej) => {
    WebSocketServer.close();

    mqttClient.end(false, res);
  }), 5000);
}