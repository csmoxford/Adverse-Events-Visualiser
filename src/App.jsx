import React, { Component } from 'react';
import {HashRouter, Route, Switch, Link} from 'react-router-dom'

import './App.css';
import Menu from './js/Menu'
import Home from './js/Home'
import TrialData from './js/TrialData'
import Error404 from './js/Error404'


class App extends Component {
  render() {
    return (
    <HashRouter>
      <div className="App">
        <Menu/>
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/trialData" component={TrialData}/>
          <Route component={Error404}/>
        </Switch>
      </div>
    </HashRouter>
    );
  }
}

export default App;
