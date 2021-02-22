import React from 'react';
import DataBus from '../../../data';
import { Button } from 'react-bootstrap';

export default class AdminControls extends React.Component {
  scan() {    
    DataBus.emit('DEVICES_SCAN', {});
  }
  
  render() {
    return <div className="widget">
      <h2>Administration</h2>      
        <Button
          block="true" 
          variant="outline-light"size="lg" onClick={() => this.scan()}>
            Scan for devices
        </Button>      
      <div>
        <h3>Cron tasks:</h3>
      </div>      
    </div >
  }
}
