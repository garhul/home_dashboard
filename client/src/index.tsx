import React from 'react';
import { MainView } from './components/mainView';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript

root.render(<React.StrictMode>  
  <MainView />
</React.StrictMode>);
