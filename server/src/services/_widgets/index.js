const { v4: uuid } = require('uuid');

const eventBus = require('../evbus/');
const evs = eventBus.evs;
const controls = require('./data');
const controlGroups = require('../../../data/controlGroups');
const logger = require('../logger')('WIDGETS_SV');
const config = require('../../../config');

class Widget {
  constructor() {
    this.id = uuid();
    this.type = "aurora";
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
    eventBus.emit(evs.WIDGETS.UPDATE, { client, data: Array.from(this.store.values()) });
  }

  loadGroups() {

    config.dataPath
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

  parsecontrols(controls, data) {
    return controls.map(row => row.map(control => {
      const ret = {};
      Object.keys(control).forEach(prop => {
        if (typeof control[prop] === 'function') {
          ret[prop] = control[prop](data);
        } else {
          ret[prop] = control[prop];
        }
      });

      return ret;
    }));
  }

  updateFromDevices(devices) {
    logger.i("Updating device widgets");
    devices.forEach(d => {
      this.store.set(d.device_id,
        {
          id: d.device_id,
          ip: d.ip,
          state: d.state,
          type: 'aurora',
          name: d.human_name,
          topic: d.topic,
          controls: this.parsecontrols(controls.aurora, d.state),
        });
      logger.d(d.state);
    });
    this.notifyUpdate();
  }

  updateFromSensors(sensor) {
    this.store.set(sensor.id,
      {
        id: sensor.id,
        type: 'sensor',
        name: sensor.name,
        controls: this.parsecontrols(controls.sensor, sensor.data),
      });
    this.notifyUpdate();
  }

  addEventHandlers() {
    logger.d('Adding event handlers');
    eventBus.addListener(evs.DEVICES.UPDATE, ({ data: devices }) => this.updateFromDevices(devices));
    eventBus.addListener(evs.SENSORS.UPDATE, (data) => this.updateFromSensors(data));
    eventBus.addListener(evs.WIDGETS.LIST, (client) => this.notifyUpdate(client));
    eventBus.addListener(evs.WIDGETS.CMD, (...args) => this.issueCMD(...args));
  }

  issueCMD({ payload, data, id }) {
    logger.d(`Issuing command`, payload);
    const widget = this.store.get(id);
    if (!widget) {
      logger.e(`No widget found with provided ID`, id);
      return;
    }

    const topics = widget.topics ?? [widget.topic];
    eventBus.emit(evs.DEVICES.CMD, { topics, payload, data });
  }
}


module.exports = new WidgetsService();