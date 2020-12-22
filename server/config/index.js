const { resolve } = require('path');

const cfg = {
  scanAtStartup: true,
  useMocks: false,
  wsPort: process.env.WS_PORT || 3030,
  baseScanAddress: '192.168.1.',
  scanBatchSize: 24,
  scanTimeout: 5000,
  mqtt: {
    broker: 'mqtt://192.168.1.10',
    announceTopic: 'announce',
    sensorsTopic: 'sensors',
  },
  sensors: {
    dataPath: resolve(__dirname, '../data'),
    timeSeriesDepth: 1440,
  },
};

module.exports = cfg;
