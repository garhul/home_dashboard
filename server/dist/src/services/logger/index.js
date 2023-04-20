"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogger = exports.getTaggedLogger = exports.logger = void 0;
const pino_http_1 = __importDefault(require("pino-http"));
const pino_1 = __importDefault(require("pino"));
const config_1 = __importDefault(require("../../../config"));
exports.logger = (0, pino_1.default)();
exports.logger.level = config_1.default.logger.level;
const getTaggedLogger = (tag) => exports.logger.child({ tag });
exports.getTaggedLogger = getTaggedLogger;
exports.httpLogger = (0, pino_http_1.default)({
    wrapSerializers: true,
    customSuccessMessage: function (req, res) {
        if (res.statusCode === 404) {
            return 'resource not found';
        }
        return `${req.method} completed`;
    },
    // Define a custom receive message
    customReceivedMessage: function (req, res) {
        return `request received: ${req.method} ${req.url}`;
    },
    // Define a custom error message
    customErrorMessage: function (req, res, err) {
        return 'request errored with status code: ' + res.statusCode;
    },
    serializers: {
        err: (err) => err,
        req: (req) => {
            const { method, query, params, url, id } = req;
            return { method, query, params, url, id };
        },
        res: (res) => {
            return { status: res.statusCode, response_length: res.headers['content-length'] };
        },
    },
});
