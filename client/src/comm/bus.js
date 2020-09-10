const socket = new WebSocket('ws://localhost:3030');

class Bus {
  constructor(socket) {
    this.socket = socket;
    this.listeners = [];
    
    this.socket.addEventListener('open', (event) => {
      console.info('Socket connected')
      this.handleEvent('open');
    });
    
    this.socket.addEventListener('message', (event) => {
      console.info('Message from server ', event.data);  
      const {ev, data} = JSON.parse(event.data);
      this.handleEvent(ev, data);
    });

    this.socket.addEventListener('error', (err) => {
      console.error(err);
    });
  }

  emit(ev, payload) {
    this.socket.send(JSON.stringify({ev, payload}));
  }

  handleEvent(ev, data) {
    this.listeners.map(val => {      
      if (val.ev === ev) {
        val.fn.call(this, data);
      }
    });
  }

  on(ev, fn) {
    this.listeners.push({ev, fn});
  }

  isConnected() {
    return this.socket.isConnected;
  }
}

const bus = new Bus(socket);
export default bus;