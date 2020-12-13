import React from 'react';
import SensorControls from './sensor'
import AdminControls from './admin';
import DeviceControls from './deviceControls';


export function Widget(props) {
  function getControls() {
    if (props.type === 'sensors') return <SensorControls {...props} />
    if (props.type === 'devices') return <DeviceControls {...props} />
    if (props.type === 'groups') return <DeviceControls {...props} />
    if (props.type === 'admin') return <AdminControls {...props} />

    return <DeviceControls {...props} />
  }

  const title = (props.type === 'admin') 
    ? (<div className="title">Admin</div>)
    : (<div className="title">{(props.name)? props.name : props.human_name }</div>)

  return (
    <div className="widget">
      {title}      
      {getControls()}
    </div>
    );  
}

export default function Widgets(props) {  
  return props.widgets.map((item, index) => <Widget type={props.location} key={index} {...item}></Widget>);
}