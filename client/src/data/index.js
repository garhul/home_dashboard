const socket = new WebSocket(`ws://${window.location.host.split(':')[0]}:3030`);
// const socket = new WebSocket(`ws://192.168.0.135:3030`);

class Bus {
  constructor(socket) {
    this.socket = socket;
    this.subscriptions = new Map();

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

  emit(ev, msg) {
    console.log({ ev, msg });
    if (this.socket.readyState === 1) {
      this.socket.send(JSON.stringify({ ev, msg }));
    } else {
      console.log('not ready yet', ev, msg);
    }
  }

  handleEvent(ev, data) {
    const hndlrs = this.subscriptions.has(ev) ? this.subscriptions.get(ev) : [];
    hndlrs.forEach(fn => fn.call(this, data));
    if (hndlrs.length === 0) {
      console.warn(`No handlers registered for ev ${ev}`);
      console.dir(data);
    }
  }

  on(ev, fn) {
    const subs = this.subscriptions.has(ev) ? [...this.subscriptions.get(ev), fn] : [fn];
    this.subscriptions.set(ev, subs);
  }

  off(ev, fn) {
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
}

const bus = new Bus(socket);

bus.on('open', () => {
  bus.emit('WIDGETS_LIST', {});
});

export default bus;