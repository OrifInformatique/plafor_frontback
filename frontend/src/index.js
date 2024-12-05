import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.pcss';
import './assets/index.css';
import './assets/tailwind.css';

import App from './App';
import './i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
