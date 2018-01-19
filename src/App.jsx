import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Menu from './js/Menu.jsx'
import Home from './js/Home.jsx'
import ToxData from './js/ToxData.jsx'
import Error404 from './js/Error404.jsx'
import {HashRouter, Route, Switch, Link} from 'react-router-dom'

class App extends Component {
  render() {
    return (
    <HashRouter>
      <div className="App">
        <Menu/>
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/ae" component={ToxData}/>
          <Route component={Error404}/>
        </Switch>
      </div>
    </HashRouter>
    );
  }
}

export default App;
