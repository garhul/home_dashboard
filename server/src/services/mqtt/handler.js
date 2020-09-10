/* eslint-disable security/detect-object-injection */
const config = require('../../../config');
const logger = require('../logger');
const { devices, sensors } = require('../../models');
const ws = require('../ws');

function announceHndlr(_topic, payload) {
  const data = payload.toString().split('|');
  try {
    devices.getInfo(data[1]);
  } catch (e) {
    logger.e(e);
  }
}

function sensorHndlr(topic, payload) {
  logger.d(`New datapoint received for ${topic} data`);
  const data = JSON.parse(payload.toString());
  const dataPoint = {
    ts: Date.now(),
    dht_temp: parseFloat(data.dht_t).toFixed(2), // temperature in celcius
    dht_humidity: parseFloat(data.dht_h).toFixed(2), // humidity relative
    bmp280_pressure: (data.bmp280_p / 100).toFixed(2), // pressure in hPA
    bmp280_temp: parseFloat(data.bmp280_t).toFixed(2),
    bat_voltage: parseFloat(data.vbat).toFixed(2), // Battery voltage
  };

  sensors.addData(dataPoint, data.deviceInfo);
  ws.broadcast(ws.evs.SENSOR_UPDATE, { dataPoint, deviceInfo: data.deviceInfo });
}

/** HANDLERS LOADING LOGIC  */
const handlers = [
  {
    topic: config.mqtt.announceTopic,
    handler: announceHndlr,
  },
  {
    topic: 'home/living/weatherst',
    handler: sensorHndlr,
  },
];

module.exports = (topic, payload) => {
  const hndlr = handlers.find((h) => h.topic === topic);

  if (hndlr === undefined) {
    logger.e(`No handler registered for topic ${topic}`);
    return;
  }

  hndlr.handler(topic, payload);
};
