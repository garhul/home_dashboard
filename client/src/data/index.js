const socket = new WebSocket('ws://localhost:3030');

class Bus {
  constructor(socket) {
    this.socket = socket;
    this.listeners = [];
    this.of = [];
    
    this.socket.addEventListener('open', (event) => {
      console.info('Socket connected')
      this.handleEvent('open');
    });
    
    this.socket.addEventListener('message', (event) => {      
      const {ev, data} = JSON.parse(event.data);
      this.handleEvent(ev, data);
    });

    this.socket.addEventListener('error', (err) => {
      console.error(err);
    });
  }

  emit(ev, payload) {    
    if (this.socket.readyState === 1) {      
      this.socket.send(JSON.stringify({ev, payload}));    
    } else {
      console.log('not ready yet', ev, payload);
    }
  }

  handleEvent(ev, data) {
    this.listeners.forEach(val => {      
      if (val.ev === ev) {
        val.fn.call(this, data);
      }
    });
  }

  on(ev, fn) {
    this.listeners.push({ev, fn});
  }
}

const bus = new Bus(socket);

bus.on('open', () => {
  bus.emit('devices.list', {});
  bus.emit('sensors.list', {});
  bus.emit('groups.list', {});
})

export default bus;