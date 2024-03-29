"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeConnections = void 0;
const config_1 = __importDefault(require("../config"));
const mqtt_1 = require("./services/mqtt");
const utils_1 = require("./utils/");
const controllers_1 = require("./controllers");
const WebSocketServer = __importStar(require("./services/ws"));
const db_1 = require("./services/db");
const logger_1 = require("./services/logger");
const logger = (0, logger_1.getTaggedLogger)('EV_DISPATCHER');
/*** Unify websockets and MQTT events to interact with entities */
const handlers = [
    {
        topic: config_1.default.mqtt.announceTopic,
        fn: (_topic, payload) => {
            controllers_1.DeviceController.handleAnnouncement(payload);
        }
    },
    {
        topic: config_1.default.mqtt.sensorsTopic,
        fn: (_toppic, payload) => {
            controllers_1.SensorController.addData(payload);
        },
    }
];
const mqttClient = (0, mqtt_1.getClient)(handlers);
WebSocketServer.init();
db_1.Devices.onChange((devices) => {
    WebSocketServer.send(null, { ev: 'DEVICES_UPDATE', data: devices.map(d => d[1]) });
});
db_1.Sensors.onChange((sensors) => {
    WebSocketServer.send(null, { ev: 'SENSORS_UPDATE', data: sensors.map(s => s[1]) });
});
async function closeConnections() {
    return (0, utils_1.timedPromise)(new Promise((res, _rej) => {
        WebSocketServer.close();
        mqttClient.end(false, res);
    }), 5000);
}
exports.closeConnections = closeConnections;
setInterval(() => {
    const randVal = () => (Math.random() * 100).toFixed(2);
    mqttClient.publish('sensors', JSON.stringify({ "data": { "t": randVal(), "h": randVal(), "p": randVal(), "vbat": randVal() }, "id": "Mockstation", "name": "Living Sensor" }));
}, 5000);
