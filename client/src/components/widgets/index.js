import React, { useState } from 'react';
import DeviceControls from './controls';
import InfoIcon from '@material-ui/icons/Info';
import { Container } from 'react-bootstrap';

function Title(props) {
  return (
    <div className="title">
      {(props.type === 'aurora') ?
        <span><a href={`http://${props.ip}`} rel="noopener noreferrer" target="_blank">{(props.name) ? props.name : props.human_name}</a></span>
        :
        <span>{(props.name) ? props.name : props.human_name}</span>
      }
      {props.showInfo && <div className="info"><InfoIcon fontSize="large" onClick={props.toggleViewInfo} /></div>}
    </div >
  );
}

function WidgetInfo(props) {
  return (
    <ul class="info">
      <li bg="light">device id: <span>{props.id}</span></li>
      <li bg="dark">ip: <span>{props.ip}</span></li>
      <li bg="dark">topic: <span>{props.topic}</span></li>
      <li bg="dark">state: <span>{JSON.stringify(props.state)}</span></li>
    </ul>
  )
}

export function Widget(props) {
  const [viewInfo, setViewInfo] = useState(false);
  return (
    <Container className="widget">
      <Title {...props} showInfo={(props.type === 'aurora')} toggleViewInfo={() => setViewInfo(!viewInfo)}></Title>
      {viewInfo ? <WidgetInfo {...props} /> : <DeviceControls {...props} />}
    </Container>
  );
}

export default function Widgets(props) {
  return props.widgets.map((item, index) => <Widget type={props.location} key={index} {...item}></Widget>);
}