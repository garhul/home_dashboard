const path = require('path');

const baseCfg = {
  scanAtStartup: false, //true,
  mockDevices: true,
  mockSensors: true,
  wsPort: process.env.WS_PORT || 3030,
  baseScanAddress: process.env.SCAN_ADDR_BASE || '192.168.1.',
  scanBatchSize: 24,
  scanTimeout: 5000,
  logger: {
    logString: '[TSTAMP] [LEVEL] [TAG] [TEXT]',
    level: process.env.LOG_LEVEL || 0, //defaults to DEBUG
    of: process.env.LOG_FILE  || null,
  },
  mqtt: {
    broker: process.env.MQTT_BROKER || 'mqtt://192.168.1.10',
    announceTopic: process.env.MQTT_ANNOUNCE_T ||'announce',
    sensorsTopic: process.env.MQTT_SENSORS_T || 'sensors',
  },
  sensors: {
    dataPath: path.resolve(__dirname, '../data'),
    persistToFile: false,
    recoverOnStartup: true,

    /* 
    144 points in 24 hours -> 10 min resolution
    144 points in 7 days -> 70 min resolution 
    144 points in 31 days ~> 5.1 hr resolution
    144 points in 1 Yr -> 2.5 days resolution
    */
    timeSeriesDepth: 144 //144, 
  },
};

const cfg = {
  prod: {
    mockDevices: false,
    mockSensors: false,
    logger: {
      path: process.env.LOG_FILE || path.resolve('/data/dashboard_sv.log')
    },
    sensors: {
      dataPath: process.env.SENSOR_DATA_PATH || path.resolve('/data'),
      persistToFile: process.env.SENSOR_PERSIST || true,
      recoverOnStartup: process.env.SENSOR_RECOVER || true,
      timeSeriesDepth: process.env.SENSOR_DEPTH || 288,
    },
  },
  dev: {}
}

module.exports = Object.assign({}, baseCfg, cfg[process.env.NODE_ENV]);