import React from 'react';
import SensorControls from './sensor'
import AuroraControls from './aurora';

function WidgetTitle(props) {
  return <div className="title">{props.name}</div>;
}

export class Widget extends React.Component {
  render() {    
    const Controls = this.props.type === 'sensors' 
      ? <SensorControls /> 
      : <AuroraControls />;
    
    return (
      <div className="widget">
        <WidgetTitle {...this.props} />
        {Controls}
      </div>
    );
  }
}


export default function Widgets(props) {
  return props.widgets.map((item, index) => <Widget key={index} {...item}></Widget>);
}


