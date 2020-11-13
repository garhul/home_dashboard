import bus from '../comm/bus';

class Widgets {
  constructor(bus){
    this.bus = bus;
    this.onUpdateWatcher = null;
    this.widgets = [];

    this.bus.on('sensors.list', (data) => {      
      data.forEach((item) => {
        this.add({
          type: 'sensors',
          name: item.label,
          topic: item.topic,
          device_id: item.device_id,
          properties: item.props
        })
      });
    });

    this.bus.on('devices.update', (data) => {      
      data.forEach((item) => {
        this.add({
          type: 'device',
          name: item.human_name,
          ip: item.ip,
          device_id: item.device_id
        });
      });
    });

    this.bus.on('open', () => this.requestData());    
  }

  requestData() {    
    // Request list of known groups
    this.bus.emit('sensors.list');
    this.bus.emit('devices.list');
  }

  add(widget) {
    this.widgets.push(widget);    
    this.onUpdateWatcher.call(this);
  }

  getAll() {
    return this.widgets;    
  }

  onUpdate(fn) {
    this.onUpdateWatcher = fn;
  }

}

const widgets = new Widgets(bus);

export default widgets;