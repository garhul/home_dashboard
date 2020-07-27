const { inspect } = require('util');
const { resolve } = require('path');

const data = {
  path: resolve(__dirname, '../data'),
};

const ws = {
  port: process.env.WS_PORT || 3030,
};

const mqtt = {
  broker: 'mqtt://192.168.0.10',
  announceTopic: 'announce',
  homeTopic: 'home/sensors/#',
};

const cfg = {
  baseScanAddress: '192.168.0.',
  mqtt,
  ws,
  data,
};

// global.logger.i(`Config results ${inspect(cfg)}`);
module.exports = cfg;
