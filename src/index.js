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

/*
Hiearchichal structure of this app:
Index =>
  App =>
    Menu
    Home page
    TrialData - stores the trial data navigating away from here will unload the data.
      LoadData - Load a json datafile (if no data is loaded this is the only available page under TrialData)
      AdverseEvents - a series of views showing the adverse event data
        ToxPlotTimeUI (plot) - a plot of the proportion of patients with an AE at any one time
        ToxTableUI (table) - a table showing the worst grade per patient
        ToxTableSummary (table) - a table summarising worst grade for each cycle
        ToxPlotCycleUI (plot) - a plot of the proportion of patients with an AE in each cycle
        ToxPlotKaplan (surival plot) - a time to event plot of the proprtion of patients experiencing and AE
        ToxAddData (add data) - a form to add additional data
        ToxPlotUI (patient level summary) - a one row per patient summary of worst AE grade
        ToxPlotUI (toxicity level summary) - a one row per AE, per patient summary of worst AE grade
        ToxFilter - A filter which allows AE plots to be made with only a subset of the data
      Treatment - a series of views showing the treatment data
      PatientSummary - a patient level view of all data
    Error404
*/
