import Websocket from 'ws';
import config from '../../../config';
import { getTaggedLogger } from '../logger';
const logger = getTaggedLogger('WS_SVC');

export interface WsPayload {
  ev: string,
  data: unknown
};

let WSServer: Websocket.Server | null = null;

export async function send(client: Websocket.WebSocket | null = null, payload: WsPayload) {
  if (WSServer === null) {
    logger.error('WS server not initialized')
    return;
  }

  if (client !== null) {
    if (client.readyState === Websocket.OPEN) {
      client.send(JSON.stringify(payload));
    } else {
      logger.error('Unable to send data, socket not open');
    }
  } else {
    const msg = JSON.stringify(payload);
    WSServer.clients.forEach((cl) => {
      if (cl.readyState === Websocket.OPEN) {
        cl.send(msg);
      }
    });
  }
}

export function init() {
  WSServer = new Websocket.Server({ port: parseInt(config.server.wsPort as string) });
  logger.info(`Websocket server started on port ${config.server.wsPort}`);

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

export function close(): Promise<void> {
  return new Promise((res, rej) => {
    WSServer?.close(err => { if (!err) { res() } else { rej(err) } })
  });
}