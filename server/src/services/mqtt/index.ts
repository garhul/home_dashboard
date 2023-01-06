import mqtt, { MqttClient } from 'mqtt';
import config from '../../../config';
import { getTaggedLogger } from '../logger';
const logger = getTaggedLogger('MQTT');

export interface MQTTHandler {
  topic: string;
  fn: (topic: string, payload: string) => void;
}

export function init(handlers: MQTTHandler[]): MqttClient {
  const mqttClient = mqtt.connect(config.mqtt.broker);

  mqttClient.on('connect', () => {
    logger.info(`Connected to mosquitto broker on ${config.mqtt.broker}`);

    handlers.forEach(h => {
      mqttClient.subscribe(h.topic, (err) => {
        if (err) {
          logger.error(err);
          throw err;
        }
        logger.info(`Subscribbed to topic ${h.topic}`);
      });
    });


    mqttClient.on('error', (err) => {
      logger.error(err);
    });

    mqttClient.on('message', (topic, message) => {
      logger.debug(`Received |${message.toString()}| on topic: ${topic}`);

      const hndlr = handlers.find((h) => h.topic === topic);

      if (hndlr === undefined) {
        logger.error(`No handler registered for topic ${topic}`);
        return;
      }

      hndlr.fn(topic, message.toString());
    });
  });

  return mqttClient;

  // eventBus.addListener(busEvents.MQTT.PUBLISH, (data:unknown) => {
  //   logger.info(`Sending mqtt device at topic ${data.topic} payload ${JSON.stringify(data.payload)}`);

  //   if (typeof (data.payload) === 'object') {
  //     data.payload = JSON.stringify(data.payload);
  //   }  
  //   mqttClient.publish(data.topic, data.payload);
  // });
}