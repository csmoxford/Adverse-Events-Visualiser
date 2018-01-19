import React, { Component } from 'react';
import {Link} from 'react-router-dom'

const Home = () => <div className="container">
  <h1>Toxicity explorer</h1>
  <p>This software allows the user to explore adverse event data from a trial. The data can be explored at a patient level or at an aggregated level. There are a number of filters available to allow the adverse events to be subset.</p>
  <p>To get started <Link to="/ae/load">load a file.</Link></p>
</div>

export default Home
