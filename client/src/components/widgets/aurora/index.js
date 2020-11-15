import React from 'react';
import { CMDButton, CMDSliider } from '../../controls';

const controls =
  [
    {
      type: "button",
      cmd: "fx",
      payload: "1",
      label: "Rainbow"
    },
    {
      type: "button",
      cmd: "fx",
      payload: "2",
      label: "Aurora"
    },
    {
      type: "button",
      cmd: "fx",
      payload: "3",
      label: "Rainbow"
    },
    {
      type: "button",
      cmd: "fx",
      payload: "4",
      label: "Rainbow"
    },
    {
      type: "button",
      cmd: "fx",
      payload: "5",
      label: "Rainbow"
    },
    {
      type: "button",
      cmd: "off",
      payload: null,
      label: "off"
    },
    {
      type: "slider", //TODO:: implement slider with logaritmic scale
      label: "brightness",
      cmd: "br",
      min: 0,
      max: 100
    },
    {
      type: "slider",
      cmd: "spd",
      label: "Speed",
      min: 0,
      max: 100,
      transform: (v) => (1 + (100 - v)),
    }
  ];


export default class AuroraControls extends React.Component {
  update(daa) {
    console.log(`Sending data`,daa);
  }
  
  render() {
    const Controls = controls.map((ctrl, index) => {
      if (ctrl.type === "button") return <CMDButton update={(data) => this.update(data)} key={index} {...ctrl}></CMDButton>;
      if (ctrl.type === "slider") return <CMDSliider update={(data) => this.update(data)} key={`slider${index}`} {...ctrl}></CMDSliider >;
      return null;
    });

    return <div id="DeviceControl">
      <h2>{this.props.name}</h2>
      <div>{Controls}</div>      
    </div >
  }
}
