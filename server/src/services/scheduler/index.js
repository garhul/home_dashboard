const { inspect, formatWithOptions } = require('util');

const fs = reuqire('fs');
const cron = require('node-cron');
const rules = require('./rules');
const logger = require('../../services/logger');

class Scheduler {
  constructor() {
    // TODO:: implement file storing / loading
    this.rules = rules;
    this.tasks = [];
  }

  #persist() {
    const data = `module.exports = ${JSON.stringify(this.rules)}`;
    fs.writeFileSync('./cron-rules.js', data, { flag: 'w+' });
  }

  add({ name, rule, topics, payload }) {
    if (cron.validate(rule)) {
      logger.d(`Adding new scheduer rule ${inspect({ name, rule, topics, payload })}`);
      this.rules.push({
        name, topics, rule, payload,
      });
      this.#persist();
    } else {
      logger.w(`Invalid rule ${rule}`);
    }
  }

  delete(id) {

  }

  registerHandlers(bus) {
    bus.register(this.handlers);
  }
}

module.exports = new Scheduler();
