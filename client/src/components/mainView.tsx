import React, { useState, useEffect } from 'react';

import AdminView from './adminView';

import SensorsView from './sensorsView';
import DevicesView from './devicesView';
import HomeView from './homeView';

import NavBar from './navigation';
import DataBus from '../data';
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

export function WsOverlay() {
  const [visible, setVisibility] = useState(true);

  useEffect(() => {
    const makeVisible = () => setVisibility(true);
    const hide = () => setVisibility(false);

    DataBus.on('close', makeVisible);
    DataBus.on('error', makeVisible);
    DataBus.on('open', hide);

    return () => {
      DataBus.off('close', makeVisible);
      DataBus.off('error', makeVisible);
      DataBus.off('open', hide);
    };
  }, []);

  return (<div id="ws-overlay" className={visible ? '' : 'hide'} >
    <div>
      <h2>WS not connected, please reload window</h2>
    </div>
  </div>)
}