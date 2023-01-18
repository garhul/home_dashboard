import React, { useState } from 'react';

import AdminView from './adminView';
import SensorsView from './sensorsView';
import DevicesView from './devicesView';
import HomeView from './homeView';

import NavBar from './navigation';
import { Container } from 'react-bootstrap';

export function MainView() {
  const [location, updateLocation] = useState(window.location.hash || "#home");  
  return (
    <div>
      <NavBar onChange={(w) => updateLocation(w)} location={location}></NavBar>
      <Container id="MainView">
        {location === '#admin' ? <AdminView /> : null}
        {location === '#sensors' ? <SensorsView /> : null} 
        {location === '#devices' ? <DevicesView/> : null}
        {location === '#home' ? <HomeView /> : null}
      </Container >
    </div>
  );
}