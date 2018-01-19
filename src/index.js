import 'bootstrap/dist/css/bootstrap.css' // bootstrap css
// React
import React from 'react';
import ReactDOM from 'react-dom';
//
import './index.css';
import App from './App.jsx';
// bootstrap and jquery for bootstrap
global.jQuery = require('jquery');

require('bootstrap') // bootstrap


ReactDOM.render(<App />, document.getElementById('root'));
