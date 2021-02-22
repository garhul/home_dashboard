module.exports = {
  WIDGETS: {
    UPDATE:'widgets.update',
    LIST: 'widgets.list',    
    CMD: 'widgets.cmd',
  },
  DEVICES: {
    UPDATE: 'devices.update',
    ANNOUNCE: 'devices.announce',
    CMD: 'devices.cmd',
    SCAN: 'devices.scan',
    GET: 'devices.get',
    LIST: 'devices.list',
  },
  SENSORS: {
    DATA: 'sensors.data',   // Emitted when new sensor data arrives
    LIST: 'sensors.list',  // Emitted when a request to list sensors is registered
    UPDATE: 'sensors.update', // Emmitted when a sensor model changes
    FETCH: 'sensors.fetch', // Emitted when a request to get a specific sensor data is registered
  },
  MQTT: {
    PUBLISH: 'mqtt.publish',
  },
};