const { resolve } = require('path');

const baseCfg = {
  scanAtStartup: false, //true,
  mockDevices: false,
  mockSensors: true,
  wsPort: process.env.WS_PORT || 3030,
  baseScanAddress: '192.168.1.',
  scanBatchSize: 24,
  scanTimeout: 5000,
  logger:{
    path:null,
  },
  mqtt: {
    broker: 'mqtt://192.168.1.10',
    announceTopic: 'announce',
    sensorsTopic: 'sensors',
  },
  sensors: {
    dataPath: resolve(__dirname, '../data/sensors'),
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
      path: resolve('/data/dashboard_sv.log')
    },
    sensors: {
      dataPath: resolve('/data'),
      persistToFile: true,
      recoverOnStartup: true,
      timeSeriesDepth: 288,
    },
  },
  dev: {}
}


module.exports = Object.assign({}, baseCfg, cfg[process.env.NODE_ENV]);
