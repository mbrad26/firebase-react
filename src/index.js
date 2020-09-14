import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './components/App';
import firebase, { FirebaseContext } from './components/Firebase';

ReactDOM.render(
  <FirebaseContext.Provider value={firebase}>
    <App />
  </FirebaseContext.Provider>,
  document.getElementById('root')
);

