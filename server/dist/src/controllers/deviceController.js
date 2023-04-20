"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.get = exports.del = exports.issueCMD = exports.handleAnnouncement = exports.add = exports.scan = void 0;
const db_1 = require("../services/db");
const logger_1 = require("../services/logger");
const utils_1 = require("../utils");
const config_1 = __importDefault(require("../../config"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const uuid_1 = require("uuid");
const mqtt_1 = require("../services/mqtt");
const logger = (0, logger_1.getTaggedLogger)('DeviceCTRL');
let scanning = false;
function getMockDev() {
    const br = 5 + Math.ceil(Math.random() * 80);
    const spd = 5 + Math.ceil(Math.random() * 80);
    const length = 5 + Math.ceil(Math.random() * 100);
    return {
        ssid: 'Brothel Misa',
        ap_ssid: 'tv bar',
        human_name: `Mock device ${(0, uuid_1.v4)()}}`,
        announce_topic: 'announce',
        device_id: `mok_dev${(0, uuid_1.v4)()}`,
        broker: '192.168.1.10',
        topic: 'mock/topic',
        build: 'v0.1.42 - 2020-10-31 19:36:47.426951',
        use_mqtt: true,
        strip_size: length,
        ip: `192.168.1.${10 + Math.ceil(Math.random() * 50)}`,
        state: { "br": br, "spd": spd, "fx": 2, "mode": 2, "size": length }
    };
}
async function scan() {
    if (scanning) {
        logger.warn('scanning already in progress');
        return;
    }
    const { baseScanAddress, scanBatchSize, scanTimeout } = config_1.default;
    let spawnedFuncs = 0;
    const queries = [];
    scanning = true;
    for (let i = 1; i < 255; i++) {
        const ip = `${baseScanAddress}${i}`;
        const fn = async () => {
            try {
                const d = await queryDevice(ip);
                return d;
            }
            catch (ex) {
                logger.warn(ex);
                return null;
            }
        };
        queries.push((0, utils_1.timedPromise)(fn(), scanTimeout)
            .catch(ex => { if (ex.message !== 'Timed out')
            logger.warn(ex.message); })
            .finally(() => spawnedFuncs--));
        spawnedFuncs++;
        if (spawnedFuncs >= scanBatchSize)
            await Promise.any(queries);
    }
    const data = (await Promise.all(queries)).filter(d => d !== null && d !== undefined);
    db_1.Devices.addBatch(data.map(v => [v.device_id, v]));
    scanning = false;
}
exports.scan = scan;
function add(device) {
}
exports.add = add;
async function handleAnnouncement(payload) {
    logger.debug(payload);
    try {
        const msg = JSON.parse(payload);
        switch (msg.ev) {
            case 'stateChange':
                updateState(msg.id, {
                    spd: msg.spd,
                    fx: msg.fx,
                    br: msg.br,
                    size: msg.size,
                    mode: msg.mode
                });
                break;
            case 'birth':
                const data = await queryDevice(msg.ip);
                logger.info(data);
                if (data !== null)
                    db_1.Devices.add(data.device_id, data);
                break;
            case 'death':
                await del(msg.id);
                break;
            default:
                throw new Error(`Unexpected message event ${msg.ev}`);
        }
    }
    catch (e) {
        logger.error(e);
    }
}
exports.handleAnnouncement = handleAnnouncement;
async function issueCMD(deviceIds, payload) {
    deviceIds.map(id => db_1.Devices.get(id).topic).forEach(topic => {
        logger.info(`Emitting ${payload} to ${topic}`);
        (0, mqtt_1.getClient)().publish(topic, payload);
    });
}
exports.issueCMD = issueCMD;
function validateDevInfo(info) {
    return (info.topic !== undefined
        && info.human_name !== undefined
        && info.device_id !== undefined);
}
;
async function queryDevice(ipAddr) {
    try {
        const infoAddr = `http://${ipAddr}/info`;
        const stateAddr = `http://${ipAddr}/state`;
        const res = await (await (0, node_fetch_1.default)(infoAddr)).json();
        if (validateDevInfo(res)) {
            const state = await (await (0, node_fetch_1.default)(stateAddr)).json();
            return {
                ...res,
                ...{ state: await state },
                stateString: JSON.stringify(state),
                infoString: JSON.stringify(res)
            };
        }
        else {
            logger.warn(`Found device at ip ${ipAddr} with invalid info json`);
        }
    }
    catch (err) {
        if (!['EHOSTUNREACH', 'ECONNREFUSED', 'ETIMEDOUT'].includes(`${err.code}`) && err.type !== 'invalid-json') {
            logger.warn(err);
        }
    }
    return null;
}
function updateState(id, state) {
    try {
        const dev = db_1.Devices.get(id);
        if (dev === null)
            throw new Error(`Device with id ${id} not found`);
        dev.state = state;
        db_1.Devices.add(id, dev);
    }
    catch (e) {
        logger.error(`Error updating state of device ${id} state:`, state);
        logger.error(e);
    }
}
function del(deviceId) {
    if (db_1.Devices.exists(deviceId)) {
        db_1.Devices.del(deviceId);
    }
    else {
        logger.warn(`Attempted to remove non registered device ${deviceId}`);
    }
}
exports.del = del;
function get(deviceId) {
    return db_1.Devices.get(deviceId);
}
exports.get = get;
function getAll() {
    return db_1.Devices.getAll().map(d => d[1]);
}
exports.getAll = getAll;
if (config_1.default.scanAtStartup)
    scan();
if (config_1.default.mockDevices && false) {
    setTimeout(() => {
        const mockdevs = [];
        for (let i = 0; i < 3; i++) {
            const d = getMockDev();
            mockdevs.push([d.device_id, d]);
        }
        db_1.Devices.addBatch(mockdevs);
    }, 3000);
}
