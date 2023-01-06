const { v4: uuid } = require('uuid');

exports.get = (amount) => {
  const ret = [];

  for (let i = 0; i < amount; i++) {
    const br = 5 + Math.ceil(Math.random() * 80);
    const spd = 5 + Math.ceil(Math.random() * 80);
    const length = 5 + Math.ceil(Math.random() * 100);

    ret.push({
      ssid: 'Brothel Misa',
      ap_ssid: 'tv bar',
      human_name: `Mock device #${i}`,
      announce_topic: 'announce',
      device_id: `under tv bar_${uuid()}`,
      broker: '192.168.1.10',
      topic: 'under_tv',
      build: 'v0.1.42 - 2020-10-31 19:36:47.426951',
      use_mqtt: true,
      strip_size: length,
      ip: `192.168.1.${10 + Math.ceil(Math.random() * 50)}`,
      state: { "br": br, "spd": spd, "fx": 2, "mode": 2, "size": length }
    });
  }

  return ret;
}

