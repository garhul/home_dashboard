const devices = require('./devices');


const ws = {
  port: process.env['WS_PORT'] || 3030
};

const mqtt = {
  broker: 'mqtt://192.168.0.10',
  announceTopic: 'announce',
}



module.exports = {
  devices,
  mqtt,
  ws
}