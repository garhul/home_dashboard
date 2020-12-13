const mqtt = require('mqtt');
const config = require('../../../config');
const logger = require('../logger');
const handlers = require('./handlers');

const mqttClient = mqtt.connect(config.mqtt.broker);
const busEvents = require('../../events');
const eventBus = require('../../eventBus');

const TAG = 'MQTT';

mqttClient.on('connect', () => {
  logger.i(`Connected to mosquitto broker on ${config.mqtt.broker}`, TAG);

  mqttClient.subscribe(config.mqtt.announceTopic, (err) => {
    if (err) {
      logger.e(err, TAG);
      throw err;
    }
    logger.i(`Subscribbed to announcements topic ${config.mqtt.announceTopic}`, TAG);
  });

  mqttClient.subscribe(config.mqtt.homeTopic, (err) => {
    if (err) {
      logger.e(err);
      throw err;
    }
    logger.i(`Subscribbed to home sensors topic ${config.mqtt.homeTopic}`, TAG);
  });

  mqttClient.on('error', (err) => {
    logger.e(err, TAG);
  });

  mqttClient.on('message', (topic, message) => {
    logger.d(`Received |${message.toString()}| on topic:|${topic}|`, TAG);

    // TODO:: implement wildcards for topics such as 'home/+/weatherst'
    const hndlr = handlers.find((h) => h.topic === topic);

    if (hndlr === undefined) {
      logger.e(`No handler registered for topic ${topic}`, TAG);
      return;
    }

    hndlr.handler(topic, message);
  });
});

eventBus.addListener(busEvents.MQTT.PUBLISH, (data) => {
  logger.i(`Sending mqtt device at topic ${data.topic} payload ${JSON.stringify(data.payload)}`, TAG);
  
  mqttClient.publish(data.topic, JSON.stringify(data.payload));
});

module.exports = mqttClient;
