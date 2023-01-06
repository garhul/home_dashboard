import path from 'path';

const baseCfg = {
  server: {
    port: process.env.SV_PORT || 1984,
    wsPort: process.env.WS_PORT || 3030,
  },
  scanAtStartup: true, //true,
  mockDevices: true,
  mockSensors: true,
  baseScanAddress: process.env.SCAN_ADDR_BASE || '10.10.1.',
  scanBatchSize: 24,
  scanTimeout: 5000,
  logger: {
    level: process.env.LOG_LEVEL || 'debug'
  },
  mqtt: {
    broker: process.env.MQTT_BROKER || 'mqtt://192.168.1.10',
    announceTopic: process.env.MQTT_ANNOUNCE_T || 'announce',
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
  rules: {
    filePath: process.env.RULES_FILE || path.resolve('/data', 'rules.json'),
  }
};

const prod = {
  mockDevices: false,
  mockSensors: false,
  sensors: {
    dataPath: process.env.SENSOR_DATA_PATH || path.resolve('/data'),
    persistToFile: process.env.SENSOR_PERSIST || true,
    recoverOnStartup: process.env.SENSOR_RECOVER || true,
    timeSeriesDepth: process.env.SENSOR_DEPTH || 288,
  },
};

const mergedConf = Object.assign({}, baseCfg, (process.env.NODE_ENV === 'PROD') ? prod : {});
export default mergedConf;
