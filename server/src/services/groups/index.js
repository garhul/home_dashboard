const { inspect } = require('util');
const store = require('../../../data/groups');
const logger = require('../../services/logger');
const controls = require('../../../data/controls');
const EVS = require('../../events');

const TAG = 'GROUPS_HANDLER';

class GroupsService {
  constructor(bus) {
    this.store = [];
    this.bus = bus;
    
    this.store = store.map(v => {
      let ctrls = 'groups';
      if (!(v.control_template in controls)) {
        logger.w(`Control template [${v.control_template}] not found`, TAG);
        logger.w('Falling back to default groups control template');
      } else {
        ctrls = controls[v.control_template];
      }
      return { ...v, controls: ctrls };
    });
        
    bus.addListener(EVS.GROUPS.LIST, (...args) => this.listGroups(...args));
    bus.addListener(EVS.GROUPS.CMD, (...args) => this.issueCMD(...args));
  }

  addGroup(name, topics, controlTemplate = 'groups') {
    this.store.push({ name, topics, controls: controls[controlTemplate] });
  }

  listGroups(client) {
    logger.d('Requested groups list', TAG);
    this.bus.emit(EVS.GROUPS.UPDATE, { client, data: Array.from(this.store) });
  }
}

module.exports = GroupsService;