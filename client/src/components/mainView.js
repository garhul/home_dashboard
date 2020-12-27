import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Widgets from './widgets';
import NavBar from './navigation';
import DataBus from '../data';

export default function MainView() {  
  const [widgets, updateWidgets] = useState([]);    
  const [location, updateLocation] = useState("");

  useEffect(() => {
    DataBus.on('WIDGETS_UPDATE',(d) => {
      // console.log('Received widgets.update', d);
      updateWidgets(d);
    });
  }, []);

  function getWidgets() {    
    switch(location) {
      case 'devices':      
        return widgets.filter(w => w.type === 'aurora');        

      case 'sensors':        
        return widgets.filter(w => w.type === 'sensor');  

      case 'home':        
        return widgets.filter(w => w.type === 'group');     
      
      default:
        return widgets;
    }
  }   

  return (              
    <div>
      <NavBar onChange={(w)=>updateLocation(w)}></NavBar>
      <div id="MainView">
        <Widgets location={location} widgets={getWidgets()}></Widgets>
      </div >
    </div>
  );
}