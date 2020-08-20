import React from 'react';
// import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

import './app.css';
import { DevicesList, DeviceControls } from './components/devicesList';
import { getAll } from  './data/devices';

const devices = getAll();
/** TODO:: to be replaced with a websockets enabled store */
// const devices = [
//   {
//     "name": "Desk lamp",
//     "topic": "desk/#",
//     "ip": "192.168.0.59",
//     "chipId": "aa3ff41",
//     "firmwareVersion": "1.0.0"
//   },
//   {
//     "name": "Round lamp",
//     "topic": "lamp/#",
//     "ip": "192.168.0.45",
//     "chipId": "aacf241",
//     "firmwareVersion": "1.0.0"
//   },
//   {
//     "name": "Window lights",
//     "topic": "home/living/window/",
//     "ip": "192.168.0.221",
//     "chipId": "aa3ff34",
//     "firmwareVersion": "1.0.0"
//   }
// ];


class App extends React.Component {
  constructor() {
    super();
    this.state = { selectedDevices: [] };
  }

  onDeviceSelected(device) {
    console.log(device);

    const index = this.state.selectedDevices.findIndex(el => el.ip === device.ip);
    if (index === -1) {
      this.state.selectedDevices.push(device);
    } else {
      this.state.selectedDevices.splice(index, 1);
    }

    this.setState({ ...this.state });

  }

  render() {
    return (
      <div id="AppContainer">
        {/* <div >
        <Nav
          activeKey="/home"
          onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
        >
          <Nav.Item>
            <Nav.Link href="/home">Active</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-1">Link</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-2">Li<div >
        <Nav
          activeKey="/home"
          onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
        >
          <Nav.Item>
            <Nav.Link href="/home">Active</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-1">Link</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-2">Link</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="disabled" disabled>
              Disabled
    </Nav.Link>
          </Nav.Item>
        </Nav>nk</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="disabled" disabled>
              Disabled
    </Nav.Link>
          </Nav.Item>
        </Nav> */}
        {/* </div> */}

        <DevicesList onDeviceSelected={(device) => this.onDeviceSelected(device)} devices={devices}></DevicesList>
        <DeviceControls devices={this.state.selectedDevices}></DeviceControls>
      </div >
    );
  }
}

export default App;
