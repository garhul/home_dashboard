const fs = require('fs');
const path = require('path');
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
    this.file = path.resolve(config.sensors.dataPath, `${this.id}.data`);
  }

  addDataSet(data) {
    const t = Date.now();
    if (config.sensors.persistToFile ) {      
      try {
        if (!fs.existsSync(this.file)) {
          const header = `${JSON.stringify({id: this.id, name: this.name})}  \n` 
          + 'time,' + Object.keys(data).join(', ') + '\n';
          fs.writeFileSync(this.file, header, { flag: 'w+' });
        }
        const row = `${t},${Object.keys(data).map(k => data[k]).join(',')}\n`;
        fs.writeFileSync(this.file, row, {flag: 'a'});              
      } catch (e) {
        logger.e(e.toString());
      }
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