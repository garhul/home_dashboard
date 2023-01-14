import React, { useState } from 'react';
import DeviceControls from './controls';
import {AiFillInfoCircle} from 'react-icons/ai';
import { Container } from 'react-bootstrap';
import { deviceData } from '@backend/types';
import useStore from '../../store/';

//TODO:: make use of proper data types
type WidgetProps = {
  controls: any;
  data: any;
  type: 'aurora' | 'sensor' | 'group';
}


function WidgetTitle(props: any) {  
  return (
    <div className="title">
      {(props.type === 'aurora') ?
        <span><a href={`http://${props.ip}`} rel="noopener noreferrer" target="_blank">{(props.name) ? props.name : props.human_name}</a></span>
        :
        <span>{(props.name) ? props.name : props.human_name}</span>
      }
      {props.showInfo && <div className="info"><AiFillInfoCircle fontSize="large" onClick={props.toggleViewInfo} /></div>}
    </div >
  );
}

function WidgetInfo(props: any) {
  return (
    <ul className="info">
      <li >device id: <span>{props.device_id}</span></li>
      <li >ip: <span>{props.ip}</span></li>
      <li >topic: <span>{props.topic}</span></li>
      <li >state: <span>{JSON.stringify(props.state)}</span></li>
    </ul>
  )
}

export function Widget(props: WidgetProps) {
  const [viewInfo, setViewInfo] = useState(false);

  const issueCMD = useStore((state) => state.issueCMD);

  const update = (payload: string, value: string) => {    
    issueCMD(props.data.device_id, JSON.stringify(payload).replace('$1', value));
  }
  
  const Controls = ((t) => {
    switch (t) {
      case'aurora':
        return <DeviceControls state={props.data.state} controls={props.controls} update={update}/>;
      
      case 'group':
        return null
        //<DeviceControls state={props.data.state} controls={props.controls} />;
    }    
  })(props.type);

  return (
    <Container className="widget">      
      <WidgetTitle {...props.data} type={props.type} showInfo={(props.type === 'aurora')} toggleViewInfo={() => setViewInfo(!viewInfo)}></WidgetTitle>
      {viewInfo ? <WidgetInfo {...props.data} /> : Controls}
    </Container>
  );
}