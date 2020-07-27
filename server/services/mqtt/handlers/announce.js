const fetch = require('node-fetch');

const { config, logger } = global;
const { devices } = require('../../../model');
// const ws = require('../../ws');

module.exports = async (payload) => {
  const data = payload.toString().split('|');
  try {
    devices.getInfo(data[1]);
  } catch (e) {
    logger.e(e);
  }
};
