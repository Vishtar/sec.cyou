import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';

const appRoot = document.getElementById('container')

if (appRoot) {
  const root = ReactDOM.createRoot(appRoot)

  root.render(<App />)
}

// ReactDOM.hydrateRoot(document.getElementById('container'), <App />);
