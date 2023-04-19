import React, { useState } from 'react';
import DeviceControls from './controls';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { Badge, Container, Row, Col } from 'react-bootstrap';
import { deviceData, expandedGroupData, sensorData } from '@backend/types';
import useStore from '../../store/';

//TODO:: make use of proper data types
type WidgetProps = {
  controls: any;
  data: deviceData | expandedGroupData | sensorData;
  type: 'aurora' | 'sensor' | 'group';
}

function WidgetTitle(props: any) {
  const Title = (props.type === 'aurora') ?
    (<span>
      <a href={`http://${props.ip}`} rel="noopener noreferrer" target="_blank">
        {(props.name) ? props.name : props.human_name}
      </a></span>) :
    (<span>{(props.name) ? props.name : props.human_name}</span>);

  const extraBadges = (props.type === 'group') ?
    (props.devices.map((d: deviceData, k: string) => <Badge bg="secondary" key={k} text="dark">{d.human_name}</Badge>)) : '';

  return (
    <Row className="title">
      <Col className="titleText">{Title}</Col>
      {extraBadges && <Col className="badges">{extraBadges}</Col>}
      <Col className="info">{props.showInfo && <AiOutlineInfoCircle onClick={props.toggleViewInfo} />}</Col>
    </Row>
  );
}

function GroupInfo(props: expandedGroupData) {
  return (
    <ul className="info">
      <li >id: <span>{props.id}</span></li>
      <li >name: <span>{props.name}</span></li>
      <li >device_ids: <span>{props.deviceIds.join(', ')}</span></li>
      <li >devices: <span>{props.devices.map(d => `${d.human_name} [${d.device_id}]`).join(', ')}</span></li>
      {props.devices.map((d, k) => (<li>{d.stateString}</li>))}
    </ul>
  )
}

function WidgetInfo(props: deviceData) {
  return (
    <ul className="info">
      <li >device id: <span>{props.device_id}</span></li>
      <li >ip: <span>{props.ip}</span></li>
      <li >topic: <span>{props.topic}</span></li>
      <li >state: <span>{JSON.stringify(props.state)}</span></li>
    </ul>
  )
}

function SensorInfo(props: sensorData) {
  return (
    <ul className="info">
      <li>device id: <span>{props.id}</span></li>
      <li>name: <span>{props.name}</span></li>
      <li>last seen: <span>{(new Date(props.last_seen)).toISOString()}</span></li>
    </ul>
  )
}

export function Widget(props: WidgetProps) {
  const [viewInfo, setViewInfo] = useState(false);

  const issueCMD = useStore((state) => state.issueCMD);

  const update = (payload: string, value: string) => {
    if (props.type === 'aurora') {
      issueCMD([(props.data as deviceData).device_id], JSON.stringify(payload).replace('$1', value));
    } else if (props.type === 'group') {
      issueCMD((props.data as expandedGroupData).deviceIds, JSON.stringify(payload).replace('$1', value));
    }
  }

  const Body = ((t) => {
    switch (t) {
      case 'aurora':
        if (viewInfo) return <WidgetInfo {...props.data as deviceData} />;
        return <DeviceControls state={(props.data as deviceData).state} controls={props.controls} update={update} />;

      case 'group':
        if (viewInfo) return <GroupInfo {...props.data as expandedGroupData} />;
        return <DeviceControls state={(props.data as expandedGroupData).devices[0]?.state} controls={props.controls} update={update} />;

      case 'sensor':
        if (viewInfo) return <SensorInfo {...props.data as sensorData} />;
        return <DeviceControls state={(props.data as sensorData)} controls={props.controls} />;
    }
  })(props.type);

  return (
    <Container className={`widget widget_${props.type}`}>
      <WidgetTitle {...props.data} type={props.type} showInfo={true} toggleViewInfo={() => setViewInfo(!viewInfo)}></WidgetTitle>
      {Body}
    </Container>
  );
}