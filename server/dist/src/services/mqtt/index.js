"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const mqtt_1 = __importDefault(require("mqtt"));
const config_1 = __importDefault(require("../../../config"));
const logger_1 = require("../logger");
const logger = (0, logger_1.getTaggedLogger)('MQTT');
function init(handlers) {
    const mqttClient = mqtt_1.default.connect(config_1.default.mqtt.broker);
    mqttClient.on('connect', () => {
        logger.info(`Connected to mosquitto broker on ${config_1.default.mqtt.broker}`);
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
exports.init = init;
