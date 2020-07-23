const { inspect } = require('util');
const { resolve } = require('path');
const devices = require('./devices');

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
  devices,
  mqtt,
  ws,
  data,
};

global.logger.i(`Config results ${inspect(cfg)}`);
module.exports = cfg;
