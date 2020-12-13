// import React from 'react';
// import DataBus from '../../../data';
// import { CMDButton, CMDSliider } from '../../controls';
// export default class AuroraControls extends React.Component {
//   update(data) {    
//     DataBus.emit('devices.cmd', data);
//   }
  
//   render() {
//     const Controls = controls.map((ctrl, index) => {
//       if (ctrl.type === "button") return <CMDButton update={(data) => this.update(data)} key={index} {...ctrl}></CMDButton>;
//       if (ctrl.type === "slider") return <CMDSliider update={(data) => this.update(data)} key={`slider${index}`} {...ctrl}></CMDSliider >;
//       return null;
//     });

//     return <div id="DeviceControl">
//       <h2>{this.props.name}</h2>
//       <div>{Controls}</div>      
//     </div >
//   }
// }
