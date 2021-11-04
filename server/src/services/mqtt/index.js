const mqtt = require('mqtt');
const config = require('../../../config');
const logger = require('../logger')('MQTT');
const handlers = require('./handlers');

const mqttClient = mqtt.connect(config.mqtt.broker);
const busEvents = require('../../events');
const eventBus = require('../../eventBus');

mqttClient.on('connect', () => {
  logger.i(`Connected to mosquitto broker on ${config.mqtt.broker}`);

  handlers.forEach(h => {
    mqttClient.subscribe(h.topic, (err) => {
      if (err) {
        logger.e(err);
        throw err;
      }
      logger.i(`Subscribbed to topic ${h.topic}`);
    });    
  });


  mqttClient.on('error', (err) => {
    logger.e(err);
  });

  mqttClient.on('message', (topic, message) => {
    logger.d(`Received |${message.toString()}| on topic: ${topic}`);

    const hndlr = handlers.find((h) => h.topic === topic);

    if (hndlr === undefined) {
      logger.e(`No handler registered for topic ${topic}`);
      return;
    }

    hndlr.handler(topic, message);
  });
});

eventBus.addListener(busEvents.MQTT.PUBLISH, (data) => {
  logger.i(`Sending mqtt device at topic ${data.topic} payload ${JSON.stringify(data.payload)}`);
  
  if (typeof(data.payload) == 'object') {    
    data.payload = JSON.stringify(data.payload);
  }
    console.dir(data.payload);
    mqttClient.publish(data.topic, data.payload); 
});

module.exports = mqttClient;
