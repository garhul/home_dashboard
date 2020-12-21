/** Widgets service:
 *  
 *  widgets are displayed on the frontend as a representation of a control set, either for a group, a device, or for a sensor.
 *  
 * 
 */

const { v4: uuid } = require('uuid');
const events = require('../../events');
const eventBus = require('../../eventBus');
const controls = require('../../../data/controls');
const controlGroups = require('../../../data/controlGroups');
const logger = require('../logger')('');


class Widget {
  constructor() {
    this.id = uuid();
    this.type = "aurora",
    this.controls = contorls.aurora;
    this.state = {};
  }

  updateState(newState) {
    this.state = newState;
  }

  serialize() {
    return JSON.stringify({
      id: this.id,
      type: this.type,
      controls: this.controls,
      state: this.state
    });
  }
}



class WidgetsService {
  
  constructor() {
    this.store = new Map();    
    
    this.loadGroups();    
    this.addEventHandlers();
    this.notifyUpdate();

  }

  notifyUpdate() {
    logger.i
    eventBus.emit(events.WIDGETS.UPDATE, {});
  }

  loadGroups() {
    controlGroups.forEach(group => {
      const id = uuid();
      this.store.set(id, {
        id,
        type: 'group',
        name: group.name,
        topics: group.topics,
        controls: controls[group.control_template],
        state: {}
      });
    });
  }

  addEventHandlers() {
    eventBus.on(events.WIDGETS.LIST, (client) => {});

    eventBus.addListener(events.WIDGETS.LIST, (...args) => this.list(...args));
    eventBus.addListener(events.WIDGETS.CMD, (...args) => this.issueCMD(...args));
  }

  updateState() {

  }


  issueCMD() {

  }
}


module.exports = new WidgetsService();