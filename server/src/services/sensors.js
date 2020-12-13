const fs = require('fs');
const path = require('path');
const { inspect } = require('util');
const logger = require('../services/logger');
const config = require('../../config');
const { TimeSeries } = require('../utils');

function sensorHndlr(topic, payload) {
  logger.d(`New datapoint received for ${topic} data`);
  const data = JSON.parse(payload.toString());
  const dataPoint = {
    ts: Date.now(),
    dht_temp: parseFloat(data.dht_t).toFixed(2), // temperature in celcius
    dht_humidity: parseFloat(data.dht_h).toFixed(2), // humidity relative
    bmp280_pressure: (data.bmp280_p / 100).toFixed(2), // pressure in hPA
    bmp280_temp: parseFloat(data.bmp280_t).toFixed(2),
    bat_voltage: parseFloat(data.vbat).toFixed(2), // Battery voltage
  };

  sensors.addData(dataPoint, data.deviceInfo);
  ws.broadcast(ws.evs.SENSOR_UPDATE, { dataPoint, deviceInfo: data.deviceInfo });
}

const sensors = new Map();
/** Sensors is a map of <key, sensor>
 *  each sensor has a topic, label, and data which is a time series object
 *  so for instance a temperature and humidity sensor would look like
 *  {
 *   topic: 'thSensor',
 *   label: 'temperature & humidity sensor'
 *   id: 'chip_FFEF43',
 *   data: [...{ts, {
 *      'temp_0' : value,
 *      'hum_0' : value,
 *      'vbat': value,
 *      }
 *    }]
 *  }
 */

/**
 *
 * @param {string} key
 * @param {object} data
 * @param {object} info
 * */
exports.addData = (data, info) => {
  const file = path.resolve(config.sensors.dataPath, `${info.device_id}.sensor.data`);
  const dataProps = Object.keys(data);
  let fileData = '';
  let s = sensors.get(info.device_id);
  if (s === undefined) {
    logger.i(`Creating a new sensor ${info.device_id}`);
    s = {
      label: info.description,
      topic: info.topic,
      device_id: info.device_id,
      props: dataProps,
      series: new TimeSeries(config.sensors.timeSeriesDepth),
    };
    fileData += `${JSON.stringify(info)}\n`;
    fileData += `${dataProps.join('|')}\n`;
  }
  const t = (data.ts) ? data.ts : Date.now();
  s.series.addDataPoint(data, t);
  sensors.set(info.device_id, s);

  // eslint-disable-next-line security/detect-object-injection
  fileData += `${(dataProps.map(property => data[property])).join('|')}\n`;

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  fs.writeFileSync(file, fileData, { flag: 'a+' });
};

exports.getTimedDataSet = (key, { t_min, t_max }, granularity) => {

};

exports.getList = () => {
  const output = [];
  sensors.forEach((v) => {
    output.push({
      label: v.label,
      topic: v.topic,
      device_id: v.device_id,
      props: v.props.slice(1), // removing ts from props list
    });
  });
  return output;
};

// reload data from files into memory
function restore() {
  // read files in the dir
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const files = fs.readdirSync(config.sensors.dataPath);
  files.forEach(name => {
    if (!name.includes('sensor.data')) return;

    const fname = path.resolve(config.sensors.dataPath, name);
    let info;
    let props;

    logger.i(`Restoring ${fname}`);
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    (fs.readFileSync(fname).toString().split('\n')).forEach((line, index) => {
      if (index === 0) {
        info = JSON.parse(line);
        sensors.set(info.device_id, {
          label: info.description,
          topic: info.topic,
          device_id: info.device_id,
          props: [],
          series: new TimeSeries(config.sensors.timeSeriesDepth),
        });
      } else if (index === 1) {
        props = line.split('|');
        logger.d(`found new props ${inspect(props)}`);
        const s = sensors.get(info.device_id);
        s.props = props;
        sensors.set(info.device_id, s);
      } else {
        const data = {};
        const values = line.split('|');
        props.forEach((property, i) => {
          // eslint-disable-next-line security/detect-object-injection
          data[property] = values[i];
        });
        const s = sensors.get(info.device_id);
        s.series.addDataPoint(data);
        sensors.set(info.device_id, s);
      }
    });
  });
}

restore();
