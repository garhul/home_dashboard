"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.init = exports.send = void 0;
const ws_1 = __importDefault(require("ws"));
const config_1 = __importDefault(require("../../../config"));
const logger_1 = require("../logger");
const logger = (0, logger_1.getTaggedLogger)('WS_SVC');
;
let WSServer = null;
async function send(client = null, payload) {
    if (WSServer === null) {
        logger.error('WS server not initialized');
        return;
    }
    if (client !== null) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(payload));
        }
        else {
            logger.error('Unable to send data, socket not open');
        }
    }
    else {
        const msg = JSON.stringify(payload);
        WSServer.clients.forEach((cl) => {
            if (cl.readyState === WebSocket.OPEN) {
                cl.send(msg);
            }
        });
    }
}
exports.send = send;
function init() {
    WSServer = new ws_1.default.Server({ port: parseInt(config_1.default.server.wsPort) });
    logger.info(`Websocket server started on port ${config_1.default.server.wsPort}`);
    WSServer.on('connection', (socket, req) => {
        logger.info(`New WS connection incoming from ${req.headers['x-forwarded-for']}`);
        socket.on('message', (message) => {
            const { ev, msg, replyTo } = JSON.parse(message.toString());
            logger.debug(`Data from ws ${ev}`);
            // const hndlr = handlers.find((h) => h.ev === ev);
            // if (hndlr === undefined) {
            //   logger.e(`No handler registered for ws event ${ev}`);
            //   return;
            // }
            // hndlr.handler(msg, replyTo, ws);
        });
    });
}
exports.init = init;
function close() {
    return new Promise((res, rej) => {
        WSServer?.close(err => { if (!err) {
            res();
        }
        else {
            rej(err);
        } });
    });
}
exports.close = close;
