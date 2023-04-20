"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.addData = void 0;
const db_1 = require("../services/db");
const logger_1 = require("../services/logger");
const logger = (0, logger_1.getTaggedLogger)('SENSOR_CTRL');
function addData(payload) {
    try {
        const { data, id, name } = JSON.parse(payload);
        const parsedData = (0, db_1.processSensorData)(id, Object.keys(data).map(k => [k, data[k]]));
        db_1.Sensors.add(id, {
            id,
            name,
            data: parsedData.map(([key, timeSeries]) => ({ key, series: timeSeries.getData() })),
            last_seen: Date.now()
        });
    }
    catch (err) {
        logger.error(err);
    }
}
exports.addData = addData;
;
function getAll() {
    return db_1.Sensors.getAll().map(s => s[1]).sort((a, b) => {
        if (a > b)
            return 1;
        if (b === a)
            return 0;
        return -1;
    });
}
exports.getAll = getAll;
