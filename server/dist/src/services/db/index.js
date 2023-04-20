"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processSensorData = exports.Sensors = exports.SchedulerRules = exports.Groups = exports.Devices = void 0;
const logger_1 = require("../logger");
const config_1 = __importDefault(require("../../../config"));
const fs_1 = __importDefault(require("fs"));
const observableCollection_1 = __importDefault(require("./observableCollection"));
const timeSeries_1 = __importDefault(require("./timeSeries"));
const logger = (0, logger_1.getTaggedLogger)('DB');
function loadFromFile(file) {
    try {
        const retval = JSON.parse(fs_1.default.readFileSync(file).toString());
        return retval;
    }
    catch (err) {
        logger.error(`Unable to load file: ${file} ${err}`);
        return [];
    }
}
function persistToFile(data, filePath) {
    try {
        const parseableData = Array.from(data);
        fs_1.default.writeFileSync(filePath, JSON.stringify(parseableData));
    }
    catch (err) {
        logger.error(`Unable to persist o ${filePath} ${err}`);
    }
}
exports.Devices = new observableCollection_1.default('Devices', loadFromFile(config_1.default.db.devicesFile));
exports.Devices.onChange((d) => persistToFile(d, config_1.default.db.devicesFile));
exports.Groups = new observableCollection_1.default('Groups', loadFromFile(config_1.default.db.groupsFile));
exports.Groups.onChange((d) => persistToFile(d, config_1.default.db.groupsFile));
exports.SchedulerRules = new observableCollection_1.default('SchedulerRules', loadFromFile(config_1.default.db.schedulerRulesFile));
exports.Sensors = new observableCollection_1.default('Sensors', null);
//TODO :: Implement persistence for sensor data
// Sensors.onChange((s) => persistToFile<sensorData>(s, config.db.sensorsFile));
const Series = new Map();
function processSensorData(sensorId, dataPointCollection) {
    const sensorTs = dataPointCollection.map(([key, value]) => {
        const normalizedVal = Math.ceil(value * 1000);
        const tsKey = `${sensorId}#${key}`;
        let timeSeries = Series.get(tsKey);
        if (!timeSeries)
            timeSeries = new timeSeries_1.default(parseInt(config_1.default.sensors.timeSeriesDepth));
        timeSeries.addSample(normalizedVal);
        Series.set(tsKey, timeSeries);
        return [key, timeSeries];
    });
    return sensorTs;
}
exports.processSensorData = processSensorData;
