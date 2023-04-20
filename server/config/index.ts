import path from 'path';

export default {
  server: {
    port: process.env.SV_PORT || 1984,
    wsPort: process.env.WS_PORT || 3030,
    clientFolder: process.env.CLIENT_FOLDER || './public'
  },

  scanAtStartup: true, //true,
  mockDevices: true,
  mockSensors: true,
  baseScanAddress: process.env.SCAN_ADDR_BASE || '10.10.1.',
  scanBatchSize: 24,
  scanTimeout: 5000,
  logger: {
    level: process.env.LOG_LEVEL || 'debug',
    destination: process.env.LOG_PATH || 2 //defaults to stderr
  },
  db: {
    groupsFile: process.env.DB_GROUPS_FILE || './data/controlGroups.json',
    devicesFile: process.env.DB_DEVICES_FILE || './data/devices.json',
    sensorsFile: process.env.DB_SENSORS_FILE || './data/sensors.json',
    schedulerRulesFile: process.env.DB_SCHEDULER_FILE || './data/scheduler.json'
  },
  mqtt: {
    broker: process.env.MQTT_BROKER || 'mqtt://10.10.1.37',
    announceTopic: process.env.MQTT_ANNOUNCE_T || 'announce',
    sensorsTopic: process.env.MQTT_SENSORS_T || 'sensors',

  },
  sensors: {
    dataPath: process.env.SENSOR_DATA_PATH || path.resolve(__dirname, '../data'),
    persistToFile: process.env.SENSOR_PERSIST || true,
    recoverOnStartup: process.env.SENSOR_RECOVER || true,
    timeSeriesDepth: process.env.SENSOR_DEPTH || '144',

    /* 
    144 points in 24 hours -> 10 min resolution
    144 points in 7 days -> 70 min resolution 
    144 points in 31 days ~> 5.1 hr resolution
    144 points in 1 Yr -> 2.5 days resolution */

  },
  rules: {
    filePath: process.env.RULES_FILE || path.resolve('/data', 'rules.json'),
  }
};
