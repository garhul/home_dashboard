/* eslint-disable security/detect-object-injection */
const config = require('../../../config');
const eventBus = require('../../eventBus');
const busEvents = require('../../events');

/** HANDLERS LOADING LOGIC  */
module.exports = [
  {
    topic: config.mqtt.announceTopic,
    handler: (_topic, payload) => {
      eventBus.emit(busEvents.DEVICES.ANNOUNCE, payload);
    },
  },
  {
    topic: 'home/living/weatherst', // TODO :: implement wildcards on topic resolve
    handler: (_topic, payload) => {
      eventBus.emit(busevents.SENSORS.ADD_DATA, payload);
    },
  },
];
