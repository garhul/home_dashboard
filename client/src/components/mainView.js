import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Widgets from './widgets';
import WsOverlay from './wsOverlay';
import NavBar from './navigation';
import DataBus from '../data';

export default function MainView() {  
  const [devices, updateDevices] = useState([]);  
  const [sensors, updateSensors] = useState([]);
  const [groups, updateGroups] = useState([]);
  const [location, updateLocation] = useState("");

  useEffect(() => {
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
  }, []);

  function getWidgets() {    
    switch(location) {
      case 'devices':      
        return devices;        

      case 'sensors':        
        return sensors;        

      case 'home':        
        return groups;     
      
      default:
        return groups;
    }
  }   

  return (              
    <div id="MainView">
      <NavBar onChange={(w)=>updateLocation(w)}></NavBar>      
      <Widgets location={location} widgets={getWidgets()}></Widgets>
    </div >
  );
}