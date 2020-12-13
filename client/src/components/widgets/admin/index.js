import React from 'react';
import DataBus from '../../../data';
import { Button } from 'react-bootstrap';

export default class AdminControls extends React.Component {
  scan() {    
    DataBus.emit('devices.scan', {});
  }
  
  render() {
    return <div id="DeviceControl">
      <h2>Administration</h2>
      <div>
        <h6>Devices control:</h6>
        <Button
          block="true" 
          variant="outline-light"size="lg" onClick={() => this.scan()}>
            Scan for devices
        </Button>
      </div>
      <div>
        <h3>Cron tasks:</h3>
      </div>      
    </div >
  }
}
