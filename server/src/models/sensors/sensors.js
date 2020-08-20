const { logger, config } = global;
const fs = require('fs');
const Sensor = require('./sensor');

class Sensors {
  constructor() {
    this.sensors = new Map();
    this.loadFromFile();
  }

  loadFromFile() {
    // load from stored shit

    const fileLineFormat = {
      label: 'some label',
      value: '31223523',
      ts: 'asdasd',

    };

    /* Format data for sensors

          Sensors file with index from sensors in the following fashion:
          these come from descriptor on each message so can be used here
          {
            SensorID,
            Description
          }

          but this goes out of here cause I want to keep this generic so it's gonna look like this
          e

          {
            Description : "sensor del pasillo",
            Key: "pasillo.sensor",
            properties: [
              {
                label:"temp"
                key:"dht_temp"

              }
            ]
          }

        */
  }

  addSensor(path, label) {
    logger.i(`Adding sensor ${path} with label:[${label}]`);
    const sensor = new Sensor(path, label);
    this.sensors.set(key, sensor);
    return sensor;
  }

  getSensor(path) {
    return this.sensors.get(key);
  }

  hasSensor(path) {
    return this.sensors.has(key);
  }

  removeSensor(key) {
    this.removeSensor.delete(key);
  }
}

module.exports = new Sensors();
