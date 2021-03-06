const { v4: uuid } = require('uuid');
const eventBus = require('../../eventBus');
const events = require('../../events');
class mockSensor {
  constructor(name, intervalTime) {
    this.intervalTime = intervalTime;
    this.interval = null;
    this.name = name;
    this.id = uuid();
    this.last = 0;
  }

  start() {
    this.interval = setInterval(() => this.update(), this.intervalTime);
  }


  getRand(min, max) {
    return (min + Math.random() * max).toFixed(2);
  }

  // Generate a single random event of sensor input
  update() {
    eventBus.emit(events.SENSORS.DATA, JSON.stringify({
      id: this.id,
      name: this.name,
      data: {
        t: this.last++,
        h: this.getRand(10, 90),
        p: this.getRand(800, 1200),
        vbat: this.getRand(3, 4.2)
      }
    }));
  }
}

exports.init = (count) => {
  for (let i = 0; i < count; i++) {
    const m = new mockSensor(`Mock sensor ${i}`, 10000);
    m.start();
  }
}