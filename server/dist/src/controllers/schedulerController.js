"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.getAll = void 0;
const db_1 = require("../services/db");
const logger_1 = require("../services/logger");
const mqtt_1 = require("../services/mqtt");
const logger = (0, logger_1.getTaggedLogger)('SchedulerCTRL');
function getAll() {
    return db_1.SchedulerRules.getAll().map(([, val]) => val);
}
exports.getAll = getAll;
// export async function add(id: string) {
// }
async function update(id, data) {
}
exports.update = update;
function triggerAction(rule) {
    const client = (0, mqtt_1.getClient)();
    // deviceIds.map(id => Devices.get(id).topic).forEach(topic => {
    //   logger.info(`Emitting ${payload} to ${topic}`);
    //   getMQTTClient().publish(topic, payload);
    // });
}
