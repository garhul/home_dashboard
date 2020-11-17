import React from 'react';
import SensorControls from './sensor'
import AuroraControls from './aurora';
import GroupControls from './group';

function WidgetTitle(props) {
  return <div className="title">{(props.name)? props.name : props.human_name }</div>;
}

export function Widget(props) {
  console.log(`props ${props.type}`);
  function getControls() {
    console.log(props.type);
    if (props.type === 'sensors') return <SensorControls {...props} />
    if (props.type === 'aurora') return <AuroraControls {...props} />
    if (props.type === 'groups') return <GroupControls {...props} />
  }

  return (
    <div className="widget">
      <WidgetTitle {...props} />
      {getControls()}
    </div>
    );  
}

export default function Widgets(props) {  
  return props.widgets.map((item, index) => <Widget key={index} {...item[1]}></Widget>);
}