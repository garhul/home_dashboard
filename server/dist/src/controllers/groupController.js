"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.issueCMD = exports.update = exports.add = exports.del = exports.get = exports.getAll = void 0;
const db_1 = require("../services/db");
const logger_1 = require("../services/logger");
// import config from '../../config';
const logger = (0, logger_1.getTaggedLogger)('GroupCTRL');
async function getAll() {
    return db_1.Groups.getAll();
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
async function add(id) {
}
exports.add = add;
async function update(id, data) {
}
exports.update = update;
async function issueCMD(id, cmdData) {
}
exports.issueCMD = issueCMD;
