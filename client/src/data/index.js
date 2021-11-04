// const socket = new WebSocket(`ws://${window.location.host.split(':')[0]}:3030`);
const socket = new WebSocket(`ws://192.168.0.135:3030`);

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
      this.handleEvent('error');
    });

    this.socket.addEventListener('close', () => {
      console.log('socket closed');
      this.handleEvent('close');
    })
  }

  emit(ev, msg) {    
    if (this.socket.readyState === 1) {      
      this.socket.send(JSON.stringify({ev, msg}));    
    } else {
      console.log('not ready yet', ev, msg);
    }
  }

  handleEvent(ev, data) {
    let hndlrs = 0;
    this.listeners.forEach(val => {      
      if (val.ev === ev) {
        hndlrs++;
        val.fn.call(this, data);
      }
    });

    if (hndlrs === 0) {
      console.warn(`No handler registered for ev ${ev}`);
      console.dir(data);
    }
  }

  on(ev, fn) {
    this.listeners.push({ev, fn});
  }
}

const bus = new Bus(socket);

bus.on('open', () => {
  bus.emit('WIDGETS_LIST', {});  
})

export default bus;