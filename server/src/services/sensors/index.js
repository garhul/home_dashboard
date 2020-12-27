const { v4: uuid } = require('uuid');
const logger = require('../logger')('SENSORS_SV');
const eventBus = require('../../eventBus');
const events = require('../../events');
const TimeSeries =  require('./timeSeries');
const config = require('../../../config');

class Sensor {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this._data = new Map();
  }

  addDataSet(data) {
    const t = Date.now();
    if (false && config.sensors.persistToFile ) {
      // TODO :: persist to file?    
    }

    for (const key in data) {
      const series = this._data.get(key) ?? new TimeSeries(config.sensors.timeSeriesDepth);
      series.addDataPoint(t, data[key]);
      logger.d(`Adding data point to field ${key} `, data[key]);
      this._data.set(key, series);
    }
  }

  get data() {
    const r = {};
    Array.from(this._data).forEach(([field, series]) => {      
      r[field] = {
        max: series.max,
        min: series.min,
        avg: series.avg,
        series: series.data
      }
    });

    return r;
  }
}

class SensorsService {
  constructor() {
    this.sensors = new Map();
    eventBus.on(events.SENSORS.DATA, (payload) => { this.addSensorData(payload) });
  }

  addSensorData({id, name, data}) {
    let sensor = this.sensors.get(id);
    if (sensor === undefined) sensor = new Sensor(id, name);
    
    sensor.addDataSet(data);
    this.sensors.set(id, sensor);    
    logger.d(`New sensor [${name}] data`, data);    

    eventBus.emit(events.SENSORS.UPDATE, sensor);
  }
}

if (config.mockSensors) {
  require('./mocks').init(5);
}

module.exports = new SensorsService();