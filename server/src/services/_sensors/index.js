const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');
const logger = require('../logger')('SENSORS_SV');
const eventBus = require('../evbus/');
const EVS = eventBus.evs;
const TimeSeries = require('./timeSeries');
const config = require('../../../config');

class Sensor {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.series = new TimeSeries(config.sensors.timeSeriesDepth);
    this.file = path.resolve(config.sensors.dataPath, `${this.id}.data`);
    this.status = "OPERATIVE";
  }

  static fromFile(file) {
    try {
      const buff = fs.readFileSync(path.resolve(config.sensors.dataPath, file));
      const lines = buff.toString().split('\n');
      const header = JSON.parse(lines.shift());
      const keys = lines.shift().split(',');
      keys.shift(); //remove time entry
      const sensor = new Sensor(header.id, header.name);

      lines.forEach(l => {
        if (l.length === 0) return;
        const vals = l.split(',');
        const ts = vals.shift();
        const v = {};

        keys.forEach((k, i) => {
          v[k.trim()] = vals[i];
        });

        sensor.addDataSet(v, Number(ts), false);
      });

      return sensor;

    } catch (ex) {
      logger.w(ex);
      return null;
    }
  }

  persist(t, data) {
    try {
      if (!fs.existsSync(this.file)) {
        const header = `${JSON.stringify({ id: this.id, name: this.name })}  \n`
          + 'time,' + Object.keys(data).join(', ') + '\n';
        fs.writeFileSync(this.file, header, { flag: 'w+' });
      }
      const row = `${t},${Object.keys(data).map(k => data[k]).join(',')}\n`;
      fs.writeFileSync(this.file, row, { flag: 'a' });
    } catch (e) {
      logger.e(e.toString());
    }
  }

  /**
   * Adds a data set as data points to each time series
   * creates a TimeSeries per key in the dataset
   * example dataSet : {temp:32, pressure: 45, etc:1234.5}
   * 
   * @param {} data the data
   * @param number ts the timestamp
   * @param bool persist shall we persist this to a file?
   */
  addDataSet(data, ts = null, persist = true) {
    const t = ts ?? Date.now();
    if (config.sensors.persistToFile && persist) this.persist(t, data);
    this.series.addDataPoint(t, data);
  }

  updateStatus(st) {
    this.status = st;
  }

  /**
   * Returns the data associated with each one of the sensor readouts grouped by timestamp and subset (day, week, etc)
   */
  get data() {
    return {
      data: this.series.data,
      state: {
        status: this.status,
        t: this.series.data.I.keys.t?.last.toFixed(2) ?? 'NA',
        h: this.series.data.I.keys.h?.last.toFixed(2) ?? 'NA',
        p: this.series.data.I.keys.p?.last.toFixed(2) ?? 'NA',
        vbat: this.series.data.I.keys.vbat?.last.toFixed(2) ?? 'NA',
      }
    };
  }
}

class SensorsService {
  constructor() {
    this.sensors = new Map();

    if (config.sensors.recoverOnStartup) {
      try {
        fs.readdirSync(config.sensors.dataPath).forEach(f => {
          if (f.toUpperCase().split('.').lastIndexOf('DATA') === -1) return;

          const S = Sensor.fromFile(f);
          this.sensors.set(S.id, S);

          eventBus.emit(EVS.SENSORS.UPDATE, S);
        });
      } catch (e) {
        logger.e(e);
      }
    }

    eventBus.on(EVS.SENSORS.DATA, (payload) => {
      const data = JSON.parse(payload.toString());
      this.updateSensor(data);
    });
  }

  updateSensor(data) {
    const { id, name } = data
    const sensor = this.sensors.get(id) ?? new Sensor(id, name ?? 'unknown');
    if (data.alert) {
      sensor.updateStatus(data.alert);
    } else {
      sensor.addDataSet(data.data);
      this.sensors.set(id, sensor);
      logger.d(`New sensor [${name}] data`, data);
    }
    eventBus.emit(EVS.SENSORS.UPDATE, sensor);
  }

}

if (config.mockSensors) {
  require('./mocks').init(1);
}

module.exports = new SensorsService();