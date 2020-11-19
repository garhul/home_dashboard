import React from 'react';
import ReactDOM from 'react-dom';
import MainView from './components/mainView';
import * as serviceWorker from './serviceWorker';
import './app.css';
import WsOverlay from './components/wsOverlay';
ReactDOM.render(
  <React.StrictMode>
    <WsOverlay />
    <MainView />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
