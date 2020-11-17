const { EventEmitter } = require('events');

const EVS = {
  DEVICES: {
    UPDATE: 'devices.update',
    ANNOUNCE: 'devices.announce',
    CMD: 'devices.cmd',
    SCAN: 'devices.scan',
    GET: 'devices.get',
    LIST: 'devices.list',
  },
  SENSORS: {
    UPDATE: 'sensors.update',
    FETCH_DATA: 'sensors.fetch_data',
    LIST: 'sensors.list',
    ADD_DATA: 'sensors.add_data',
  },
  GROUPS: {
    LIST: 'groups.list',
    UPDATE: 'groups.update',
    CMD: 'groups.cmd',
  },
};

class EventBus extends EventEmitter {
  constructor() {
    super();
    this.EVS = EVS;
    this.topics = [];
  }
}

module.exports = new EventBus();
