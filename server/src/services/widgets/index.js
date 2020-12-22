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
const logger = require('../logger')('WIDGETS_SV');


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

  notifyUpdate(client = null) {
    logger.i('Widgets list updated');
    eventBus.emit(events.WIDGETS.UPDATE, { client, data: Array.from(this.store.values()) });
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


  /** constructs a widget from a device */
  getDeviceWidget(device) {
    return new Widget();
  }

  parsecontrols(controls, state) {
    // Im tired now bu tproblem here is that the refrence of control ends up being shared across all widgets
    return controls.map(row => row.map(control => {        
      const ret = {};        
      Object.keys(control).forEach(prop => {
        if (typeof control[prop] === 'function') {
          ret[prop] = control[prop](state);            
        } else {
          ret[prop] = control[prop];
        }
      });
      
      return ret;
      }));
  }

  addEventHandlers() {    
    eventBus.addListener(events.DEVICES.UPDATE, ({data: devices}) => {      
      logger.i("Updating device widgets");
      devices.forEach(d => {        
        this.store.set(d.device_id,
          {
            id: d.device_id,
            type: 'aurora',
            name: d.human_name,
            topic: d.topic,            
            controls: this.parsecontrols(controls.aurora, d.state),            
          });        
          logger.d(d.state);
      });
      this.notifyUpdate();
    });

    eventBus.addListener(events.WIDGETS.LIST, (client) => {
     this.notifyUpdate(client);
    });

    eventBus.addListener(events.WIDGETS.CMD, (...args) => this.issueCMD(...args));
  }

  issueCMD(payload) {
    logger.d('Command issued');
    logger.d(payload);
  }
}


module.exports = new WidgetsService();