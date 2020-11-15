import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Widgets from './widgets';
import NavBar from './navigation';
import DataBus from '../data';


export default function MainView() {  
  const [devices, updateDevices] = useState([]);  
  const [sensors, updateSensors] = useState([]);
  const [groups, updateGroups] = useState([]);
  const [location, updateLocation] = useState("");

  useEffect(() => {
    DataBus.emit('devices.list', {});
    DataBus.emit('groups.list', {});
    DataBus.emit('sensors.list', {});

    DataBus.on('devices.update',(d) => {
      console.log('Received devices.update', d);
      updateDevices(d);
    });

    DataBus.on('sensors.update',(d) => {
      console.log('Received sensors.update', d);
      updateSensors(d);
    });

    DataBus.on('groups.update',(d) => {
      console.log('Received groups.update', d);
      updateGroups(d);
    });


  });

  function getWidgets() {    
    if (location === 'devices') return devices;
    if (location === 'sensors') return sensors;
    //default return 
    return groups;
  }

  return (              
    <div id="MainView">
      <NavBar onChange={(w)=>updateLocation(w)}></NavBar>      
      <Widgets widgets={getWidgets()}></Widgets>
    </div >
  );
}