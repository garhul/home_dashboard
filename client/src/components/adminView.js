import React, { useEffect, useState } from 'react';
import DataBus from '../data';
import { Button, Container } from 'react-bootstrap';

function SysInfo(props) {
  return (<Container>
    asd
  </Container>)
}

function Task(props) {

}

function TaskList(props) {

}

export default function AdminView(props) {
  let [isScanning, setScan] = useState(false);
  useEffect(() => {
    DataBus.on('DEVICES_SCAN', console.log);
    return () => DataBus.off('DEVICES_SCAN', console.log);
  }, []);

  return (
    <div className="widget">
      <h2>Administration</h2>
      <Button block="true" variant="outline-light" size="lg" onClick={() => DataBus.emit('DEVICES_SCAN', {})}>
        Scan for devices
      </Button>
      <div>
        <h3>Cron tasks:</h3>
      </div>
    </div >
  );
}

