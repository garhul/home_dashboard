"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = require("./services/logger");
const config_1 = __importDefault(require("../config"));
const cors_1 = __importDefault(require("cors"));
const router_1 = __importDefault(require("./router"));
const evDispatcher_1 = require("./evDispatcher");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(logger_1.httpLogger);
const errHandler = (err, _req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_next) => {
    logger_1.logger.error(err.stack);
    res.status(500).send('Something broke!');
};
app.use(router_1.default);
const server = app.listen(config_1.default.server.port, () => {
    logger_1.logger.info(`Listening at http://localhost:${config_1.default.server.port}/api`);
});
app.use(errHandler);
server.on('error', logger_1.logger.error);
process.on('uncaughtExceptionMonitor', (err) => {
    logger_1.logger.error(`Uncaught error ${err}`);
});
process.on('beforeExit', () => {
    logger_1.logger.info('closing connections...');
    (0, evDispatcher_1.closeConnections)();
});
process.on('uncaughtExceptionMonitor', (ex) => {
    logger_1.logger.error(ex.message);
});
