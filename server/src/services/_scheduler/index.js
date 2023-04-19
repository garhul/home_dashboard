const fs = require('fs');
const cron = require('node-cron');
const logger = require('../../services/logger')('SCHEDULER_SV');
const config = require('../../../config');
const eventBus = require('../evbus');
const BUS_EVS = eventBus.evs;

class Scheduler {
  constructor() {
    this.#loadRules()
    this.#addEventHandlers();
  }

  #loadRules() {
    if (fs.existsSync(config.rules.filePath)) {
      logger.i(`loading rules from ${config.rules.filePath}`);
      this.rules = JSON.parse(fs.readFileSync(config.rules.filePath));
    } else {
      logger.w(`rules loading failed`);
      this.rules = [];
    }
  }

  #addEventHandlers() {
    eventBus.addListener(BUS_EVS.SCHEDULER.LIST, (_msg, replyTo, client) => { logger.i(`${replyTo}`) });
  }

  parseRules() {
    this.rules.forEach(schedule => {
      cron.schedule(schedule.rule, () => {
        logger.d(`executing rule "${schedule.name}" - "${schedule.payload}")`);
        eventBus.emit(EVS.SCHEDULER.TRIGGER)
      })
    });
  }

  persist() {
    fs.writeFileSync(config.rules.filePath, JSON.stringify(this.rules), { flag: 'w+' });
  }

  //TODO:: implement rule update

  add({ name, rule, topics, payload }) {
    if (cron.validate(rule)) {
      logger.d(`Adding new scheduer rule ${inspect({ name, rule, topics, payload })}`);
      this.rules.push({
        name, topics, rule, payload,
      });
      this.persist();
      this.notifyUpdate();
    } else {
      logger.w(`Invalid rule ${rule}`);
    }
  }

  delete(idx) {
    this.rules.splice(idx, 1);
    this.persist();
    this.notifyUpdate();
  }

  notifyUpdate(client = null) {
    logger.i('Scheduler rules updated');
    eventBus.emit(BUS_EVS.SCHEDULER.UPDATE, { client, data: Array.from(this.store.values()) });
  }
}

module.exports = new Scheduler();