import React, {Component}  from 'react'
import {Switch, Route} from 'react-router-dom'

import TreatmentPlotOuter from './TreatmentPlot/TreatmentPlotOuter'

import TreatmentTable from './TreatmentTable/TreatmentTable'

import Error404 from '../Error404'

var k = 0

class Treatment extends Component {

  render() {

    const {data, totalHeight, showDetails, selectedPatient} = this.props

    if(data.treatmentSpecification === undefined) {
      return <div className="item-middle">
        <div style={{height: '30px'}}></div>
        <p>No detailed treatment data has been uploaded.</p>
        <p>If you beleive this is incorrect check the data specification on the load page.</p>
    </div>
    }

    return <Switch>
      <Route key={0} path='/trialData/treatment/patient' render={() => <TreatmentPlotOuter  data={data} totalHeight={totalHeight} showDetails={showDetails} selectedPatient={selectedPatient} />}/>
      <Route key={1} path='/trialData/treatment/table' render={() => <div className="item-main"><div style={{height: '30px'}}></div><TreatmentTable  data={data}/></div>}/>
      <Route key={2} render={Error404}/>
    </Switch>

  }
}


export default Treatment
