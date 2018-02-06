import React, { Component } from 'react';
import {Link} from 'react-router-dom'

const Home = () => <div className="container">
  <h1>Toxicity explorer</h1>
  <div style={{textAlign: 'left'}}>
  <p>This software allows the user to explore adverse event data from a trial. The data can be explored at a patient or an aggregated level. There are a number of filters available to allow the adverse events to be subset and explored in greater detail.</p>
  <p>To get started <Link to="/trialData/load">load a file or find out about the required data structure.</Link></p>
  </div>
</div>

export default Home
