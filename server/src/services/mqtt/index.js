const mqtt = require('mqtt');
const { inspect } = require('util');
const config = require('../../../config');
const logger = require('../logger');
const handlers = require('./handlers');

const mqttClient = mqtt.connect(config.mqtt.broker);
const eventBus = require('../../eventBus');

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

    // TODO:: implement wildcards for topics such as 'home/+/weatherst'
    const hndlr = handlers.find((h) => h.topic === topic);

    if (hndlr === undefined) {
      logger.e(`No handler registered for topic ${topic}`);
      return;
    }

    hndlr.handler(topic, message);
  });
});

eventBus.addListener(eventBus.EVS.DEVICES.CMD, (payload) => {
  logger.i(`Sending device CMD ${inspect(payload)}`);
});

module.exports = mqttClient;
