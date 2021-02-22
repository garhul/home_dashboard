import React from 'react';
import AdminControls from './admin';
import DeviceControls from './device';

function getTitle(props) {
  if (props.type === 'admin')
    return (<div className="title">Admin</div>);
  
  //TODO:: implement icon for battery alert
  return (<div className="title">
      <span>{(props.name)? props.name : props.human_name }</span>
  </div>)
}

export function Widget(props) {  
  function getControls() {    
    if (props.type === 'admin') return <AdminControls {...props} />
    return <DeviceControls {...props} />
  }

  return (
    <div className="widget">
      {getTitle(props)}
      {getControls()}
    </div>
    );  
}

export default function Widgets(props) {  
  return props.widgets.map((item, index) => <Widget type={props.location} key={index} {...item}></Widget>);
}