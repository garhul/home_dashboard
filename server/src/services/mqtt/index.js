const mqtt = require('mqtt');
const config = require('../../../config');
const logger = require('../logger');
const msgHandler = require('./handler');

const mqttClient = mqtt.connect(config.mqtt.broker);

mqttClient.on('connect', () => {
  logger.i(`Connected to mosquitto broker on ${config.mqtt.broker}`);

  mqttClient.subscribe(config.mqtt.announceTopic, (err) => {
    if (err) {
      logger.e(err);
      throw err;
    }
    logger.i(`Subscribbed to announcements topic ${config.mqtt.announceTopic}`);
  });

  mqttClient.subscribe(config.mqtt.homeTopic, (err) => {
    if (err) {
      logger.e(err);
      throw err;
    }
    logger.i(`Subscribbed to home sensors topic ${config.mqtt.homeTopic}`);
  });

  mqttClient.on('error', (err) => {
    logger.e(err);
  });

  mqttClient.on('message', (topic, message) => {
    logger.d(`Received |${message.toString()}| on topic:|${topic}|`);
    msgHandler(topic, message);
  });
});

module.exports = mqttClient;