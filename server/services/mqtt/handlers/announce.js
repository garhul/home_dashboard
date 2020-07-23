const fetch = require('node-fetch');

const { config, logger } = global;
const { devices } = require('../../storage');
// const ws = require('../../ws');

module.exports = async (payload) => {
  const data = payload.toString().split('|');

  try {
    const res = await fetch(`http://${data[1]}/info`);
    const json = await res.json();
    devices.add(json);
  } catch (e) {
    logger.e(e);
  }
};
