const { resolve } = require('path');

const cfg = {
  sensorDataPath: resolve(__dirname, '../data'),
  wsPort: process.env.WS_PORT || 3030,
  baseScanAddress: '192.168.0.',
  mqtt: {
    broker: 'mqtt://192.168.0.10',
    announceTopic: 'announce',
    homeTopic: 'home/+/sensor',
  },
};

// global.logger.i(`Config results ${inspect(cfg)}`);
module.exports = cfg;
