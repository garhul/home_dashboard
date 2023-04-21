
import { v4 as uuidv4 } from 'uuid';
export type evHandler = (data: any) => void;

export default class WS {
  socket: WebSocket;
  subscriptions: Map<any, any>;
  constructor() {
    this.subscriptions = new Map();
  }

  init(uri: string) {
    this.socket = new WebSocket(uri);
    this.socket.addEventListener('open', (event) => {
      console.info('Socket connected')
      this.handleEvent('open');
    });

    this.socket.addEventListener('message', (event) => {
      const { ev, data } = JSON.parse(event.data);
      this.handleEvent(ev, data);
    });

    this.socket.addEventListener('error', (err) => {
      console.error(err);
      this.handleEvent('error');
    });

    this.socket.addEventListener('close', () => {
      console.log('socket closed');
      this.handleEvent('close');
    })
  }

  async emit(ev: string, msg, expectResponse = false) {
    return new Promise((resolve, reject) => {
      console.info(`Emitting message: ${JSON.stringify({ ev, msg })}`);

      if (this.socket.readyState !== 1) {
        console.log('not ready yet', ev, msg);
        reject(new Error('Not ready to send'));
      }

      if (expectResponse) {
        const rspKey = `${ev}|${uuidv4()}`;
        this.on(rspKey, (rspData) => {
          this.subscriptions.delete(rspKey);
          resolve(rspData);
        });
        this.socket.send(JSON.stringify({ ev, msg, replyTo: rspKey }));
      } else {
        this.socket.send(JSON.stringify({ ev, msg, replyTo: false }));
        resolve(null);
      }
    });
  }

  handleEvent(ev: string, data?: any) {
    const hndlrs = this.subscriptions.has(ev) ? this.subscriptions.get(ev) : [];
    hndlrs.forEach(fn => fn.call(this, data));
    if (hndlrs.length === 0) {
      console.warn(`No handlers registered for ev ${ev}`);
    }
  }

  on(ev: string, fn: evHandler) {
    const subs = this.subscriptions.has(ev) ? [...this.subscriptions.get(ev), fn] : [fn];
    this.subscriptions.set(ev, subs);
  }

  off(ev: string, fn: evHandler) {
    const subs = this.subscriptions.get(ev);

    if (subs === undefined) {
      console.warn(`ev:${ev} has no handler registered`);
      return;
    }

    const idx = subs.findIndex((f) => (f === fn));
    subs.splice(idx, 1);

    if (subs.length === 0) {
      this.subscriptions.delete(ev)
    } else {
      this.subscriptions.set(ev, subs);
    }
  }

  isConnected() {
    return this.socket.readyState === 1;
  }
}