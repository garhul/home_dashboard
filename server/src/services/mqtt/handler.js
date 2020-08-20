/* eslint-disable security/detect-object-injection */
const { config, logger } = global;
const fs = require('fs');
const { devices, sensors } = require('../../models');
const DB = require('../rrd');

function announceHndlr(_topic, payload) {
  const data = payload.toString().split('|');
  try {
    devices.getInfo(data[1]);
  } catch (e) {
    logger.e(e);
  }
}

function sensorHndlr(topic, payload) {
  logger.i(`New datapoint received for ${topic} data`);
  const data = JSON.parse(payload.toString());
  // Key should be "living " for topic home/living/sensor
  const key = `${topic.split('/')[1]}.${data.deviceInfo.device_id}`;
  const dataPoint = JSON.stringify({
    dht_temp: data.dht_t, // temperature in celcius
    dht_humidity: data.dht_h, // humidity relative
    bmp280_pressure: data.bmp280_p / 100, // pressure in hPA
    bmp280_temp: data.bmp280_t,
    bat_voltage: data.vbat, // Battery voltage
  });

  if (!(sensors.has(key)) {
    sensors.add(key, {
      device_id: data.deviceInfo.device_id,
      description: data.deviceInfo.description,
      topic
    });
  } else {
    const sensor = sensor.get(key);
    sensor.addDataPoint()
  }



  Object.keys(dataPoint)
    .forEach(field => {
      const key = `${keyBase}.${field}`;
      const table = (DB.hasTable(key)) ? DB.getTable(key) : DB.addTable(key, data.deviceInfo.description);
      table.timeSeries.addDataPoint(dataPoint[field]);
    });


  sensors.a
  fs.writeFileSync('sensorData', `${dataPoint}\n`, { flag: 'a+' });
}

/** HANDLERS LOADING LOGIC  */

const handlers = [
  {
    topic: config.mqtt.announceTopic,
    handler: announceHndlr,
  },
  {
    topic: 'home/living/sensor',
    handler: sensorHndlr,
  }];

module.exports = (topic, payload) => {
  const hndlr = handlers.find((h) => (h.topic === topic));

  if (hndlr === undefined) {
    logger.e(`No handler registered for topic ${topic}`);
    return;
  }

  hndlr.handler(topic, payload);
};
