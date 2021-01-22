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
    this.series = new TimeSeries(config.sensors.timeSeriesDepth);
    this.file = path.resolve(config.sensors.dataPath, `${this.id}.data`);
  }

  persist(t, data) {
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
  
  /**
   * Adds a data set as data points to each time series
   * creates a TimeSeries per key in the dataset
   * example dataSet : {temp:32, pressure: 45, etc:1234.5}
   * 
   * @param {} data 
   */
  addDataSet(data, ts = null) {
    const t = ts ?? Date.now();
    if (config.sensors.persistToFile ) this.persist(t, data);
    this.series.addDataPoint(t, data);
    
    // logger.d(`Adding data point  `, data);    
  }


  /**
   * Returns the data associated with each one of the sensor readouts grouped by timestamp and subset (day, week, etc)
   */
  get data() {
    return this.series.data;
  }
}

class SensorsService {
  constructor() {
    this.sensors = new Map();
        
    if (config.sensors.recoverOnStartup) {
      try {
        fs.readdirSync(config.sensors.dataPath).forEach(f => {
          const buff = fs.readFileSync(path.resolve(config.sensors.dataPath, f));
          const lines = buff.toString().split('\n');
          const header = JSON.parse(lines.shift());
          const keys = lines.shift().split(',');
          keys.shift(); //remove time entry
          const sensor = this.sensors.get(header.id) ?? new Sensor(header.id, header.name);
          
          lines.forEach(l => {
            if (l.length === 0) return;
            const vals = l.split(',');
            const ts = vals.shift();
            const v = {};

            keys.forEach((k, i) => {
              v[k.trim()] = vals[i];
            });

            sensor.addDataSet(v, parseInt(ts));
          });
          
          this.sensors.set(header.id, sensor);
          eventBus.emit(events.SENSORS.UPDATE, sensor);
        });
      } catch (e) {
        console.dir(e);
        logger.e(e.toString());
      }      
    }

    eventBus.on(events.SENSORS.DATA, (payload) => { this.addSensorData(payload) });
  }

  addSensorData({id, name, data}) {
    const sensor = this.sensors.get(id) ?? new Sensor(id, name);
    
    sensor.addDataSet(data);
    this.sensors.set(id, sensor);
    logger.d(`New sensor [${name}] data`, data);

    eventBus.emit(events.SENSORS.UPDATE, sensor);
  }
}

if (config.mockSensors) {
  require('./mocks').init(1);
}

module.exports = new SensorsService();