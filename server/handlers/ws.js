const logger = require('simple-fancy-logger')();

module.exports = (message, mqttClient) => {
  const data = JSON.parse(message.utf8Data);
  const returns = {};

  if ('topics' in data) {
    const { topics, cmd, payload } = data;

    topics.forEach((topic) => {
      const parsedTopic = topic.replace('#', cmd);

      logger.i(`Sending message: ${parseInt(payload).toString()} to topic ${parsedTopic}`);
      mqttClient.publish(parsedTopic, parseInt(payload).toString());
    });
  }

  return JSON.stringify(returns)
}