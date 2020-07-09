import React from 'react';
import { controls, CMDButton, CMDSliider } from './controls/controls';
import socket from '../comm/ws';


class Device extends React.Component {
  render() {
    return <div onClick={() => { this.props.onDeviceSelected(this.props) }} className="device-item">
      <h3>{this.props.name}</h3>
      <h4>{this.props.ip}</h4>
    </div>
  }
}


export class DevicesList extends React.Component {
  render() {
    const devices = this.props.devices.map((device, index) => {
      return <Device onDeviceSelected={this.props.onDeviceSelected} key={index} {...device}></ Device>;
    });

    return <div id="DevicesList"><h3>Devices</h3>{devices}</div>
  }
}



export class DeviceControls extends React.Component {

  send(data) {
    console.log('sending data:' + JSON.stringify(data));
    const topics = this.props.devices.map(device => device.topic);
    socket.send(JSON.stringify({ topics, cmd: data.cmd, payload: data.payload }));
  }

  render() {
    console.log(this.props);
    if (this.props.devices.length === 0)
      return <h2>Select device(s)</h2>

    const Buttons = controls.map((ctrl, index) => {
      if (ctrl.type === "button") return <CMDButton update={(data) => this.send(data)} key={index} {...ctrl}></CMDButton>;
      if (ctrl.type === "slider") return <CMDSliider update={(data) => this.send(data)} key={`slider${index}`} {...ctrl}></CMDSliider >;
      return null;
    });

    const sliders = "sliders be here";

    const deviceNames = this.props.devices.map(device => device.name);
    return <div id="DeviceControl">
      <h2>{deviceNames.join(' | ')}</h2>
      <div>{Buttons}</div>
      <div></div>
      <div>{sliders}</div>
    </div >
  }
}