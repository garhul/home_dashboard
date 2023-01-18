// import React from 'react';
import { Widget } from './widgets';
import { Container } from 'react-bootstrap';
import useStore from '../store/';
import { DeviceCtrl } from './controlDefinitions';

export default function DevicesView() {
  const store = useStore((store)=>store.devices);
  
  const widgets = store.map((d) => <Widget controls={DeviceCtrl} type='aurora' key={d.device_id} data={d}></Widget>);
  //TODO:: add scan/button to the top right or something like so
  return (
    <Container>
      {widgets}
    </Container>
  );
}