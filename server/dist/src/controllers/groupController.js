"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.add = exports.issueCMD = exports.del = exports.get = exports.getAll = void 0;
const db_1 = require("../services/db");
const logger_1 = require("../services/logger");
const mqtt_1 = require("../services/mqtt");
const logger = (0, logger_1.getTaggedLogger)('GroupCTRL');
function getAll() {
    return db_1.Groups.getAll().map(([_id, group]) => group);
}
exports.getAll = getAll;
function get(id) {
    return db_1.Groups.get(id);
}
exports.get = get;
function del(id) {
    return db_1.Groups.del(id);
}
exports.del = del;
async function issueCMD(groupId, payload) {
    //find which device is it  
    const topics = db_1.Groups.get(groupId).deviceIds.map(id => db_1.Devices.get(id).topic);
    topics.forEach(topic => {
        logger.info(`Emitting ${payload} to ${topic}`);
        (0, mqtt_1.getClient)().publish(topic, payload);
    });
}
exports.issueCMD = issueCMD;
async function add(id) {
}
exports.add = add;
async function update(id, data) {
}
exports.update = update;
