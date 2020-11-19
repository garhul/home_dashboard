import React, { useEffect, useState } from 'react';
import DataBus from '../data';

export default function WsOverlay() {
  const [visible, setVisibility] = useState(true);

  useEffect (() => {
    DataBus.on('close', () => setVisibility(true));
    DataBus.on('error', () => setVisibility(true));
    DataBus.on('open', () => setVisibility(false));
  
  }, []);

  return (<div id="ws-overlay" className={visible? '' : 'hide'} >
    <div>
      <h2>WS not connected, please reload window</h2>
    </div>
  </div>)
}