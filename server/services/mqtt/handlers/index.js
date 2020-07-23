const { config, logger } = global;
const announcementHandler = require('./announce');

const handlers = [
  {
    topic: config.mqtt.announceTopic,
    handler: announcementHandler,
  }];

module.exports = (topic, payload) => {
  const hndlr = handlers.find((h) => {
    logger.i(h.topic);
    return (h.topic === topic);
  });

  if (hndlr === undefined) {
    logger.e(`No handler registered for topic ${topic}`);
    return;
  }

  hndlr.handler(payload);
};
