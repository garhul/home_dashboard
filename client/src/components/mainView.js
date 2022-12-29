import React, { useState, useEffect } from 'react';

import AdminView from './adminView';
import GroupsView from './groupsView';
import SensorsView from './sensorsView';
import DevicesView from './devicesView';

import NavBar from './navigation';
import DataBus from '../data';
import { Container } from 'react-bootstrap';

export function MainView() {
  const [widgets, updateWidgets] = useState([]);
  const [location, updateLocation] = useState("");

  useEffect(() => {
    DataBus.on('WIDGETS_UPDATE', updateWidgets);
    return () => {
      DataBus.off('WIDGETS_UPDATE', updateWidgets);
    }
  }, []);

  return (
    <div>
      <NavBar onChange={(w) => updateLocation(w)}></NavBar>
      <Container id="MainView">
        {location === 'admin' ? <AdminView /> : null}
        {location === 'sensors' ? <SensorsView widgets={widgets.filter(w => w.type === 'sensor')} /> : null}
        {location === 'devices' ? <DevicesView widgets={widgets.filter(w => w.type === 'aurora')} /> : null}
        {location === 'home' ? <GroupsView widgets={widgets.filter(w => w.type === 'group')} /> : null}
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