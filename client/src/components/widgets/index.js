import React from 'react';
import SensorControls from './sensor'
// import AuroraControls from './aurora';
import DeviceControls from './deviceControls';

function WidgetTitle(props) {
  return <div className="title">{(props.name)? props.name : props.human_name }</div>;
}

export function Widget(props) {
  function getControls() {
    if (props.type === 'sensors') return <SensorControls {...props} />
    if (props.type === 'devices') return <DeviceControls {...props} />
    if (props.type === 'groups') return <DeviceControls {...props} />

    return <DeviceControls {...props} />
  }

  return (
    <div className="widget">
      <WidgetTitle {...props} />
      {getControls()}
    </div>
    );  
}

export default function Widgets(props) {  
  return props.widgets.map((item, index) => <Widget type={props.location} key={index} {...item[1]}></Widget>);
}