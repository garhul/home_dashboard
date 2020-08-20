
let devices = [];

export function get(deviceId) {
  return devices[deviceId];
}

export function add(device) {
  devices[device.device_id] = device;
}

export function getAll() {
  return devices;
}

export function set(devs) {
  console.log(devs);
  devices = devs;
}
