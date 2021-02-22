const { EventEmitter } = require('events');
const logger = require('./services/logger')('EVENT_BUS');
class EventBus extends EventEmitter {
  emit(evName, ...args) {
    const hasListeners = super.emit(evName, ...args);
    if (!hasListeners) {
      logger.w(`Unhandled event emmited ${evName}`);
    }

    return hasListeners;
  }
}

module.exports = new EventBus();
