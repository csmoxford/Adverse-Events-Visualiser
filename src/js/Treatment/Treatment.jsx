import React, {Component}  from 'react'
import {Switch, Route} from 'react-router-dom'

import TreatmentPlotOuter from './TreatmentPlot/TreatmentPlotOuter'

import TreatmentTable from './TreatmentTable/TreatmentTable'


class Treatment extends Component {



  render() {

    const {data, totalHeight, showDetails, selectedPatient} = this.props

    return <Switch>
      <Route path='/trialData/treatment/patient' component={() => <TreatmentPlotOuter  data={data} totalHeight={totalHeight} showDetails={showDetails} selectedPatient={selectedPatient} />}/>
      <Route path='/trialData/treatment/table' component={() => <div className="item-main"><div style={{height: '30px'}}></div><TreatmentTable  data={data}/></div>}/>
    </Switch>

  }
}


export default Treatment
