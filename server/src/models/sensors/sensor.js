const { TimeSeries } = require('../../utils');

class SensorData {
  constructor(path, label) {
    this.timeSeries = new TimeSeries();
    this.path = path;
    this.label = label;
    this.params = new Map();
  }

  hasParam(key) {
    return this.params.has(key);
  }

  addParam(label, key) {
    this.params.set(key, {label, data: new TimeSeries});
  }

  addData(path, value) {
    if (this.params.has(path)) {
      this.params.
    this..addDataPoint(value);
    // TODO:: notify shit
    // ws.send(JSON.stringify({ ev: evs.SENSOR_UPDATE, payload: { key: this.key, value } }));
  }
}

module.exports = SensorData;
