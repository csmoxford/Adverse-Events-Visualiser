import React, {Component}  from 'react'
import {Switch, Route} from 'react-router-dom'

import Error404 from '../Error404'

import ToxPlotUI from './ToxPlot/ToxPlotUI'
import ToxPlotTimeUI from './ToxPlot/ToxPlotTimeUI'

import ToxTableUI from './ToxTable/ToxTableUI'
import ToxTableSummary from './ToxTable/ToxTableSummary'

import ToxPlotCycleUI from './ToxPlot/ToxPlotCycleUI'
import ToxPlotKaplan from './ToxPlot/ToxPlotKaplan'
import ToxAddData from './ToxAddData'

class AdverseEvents extends Component {


  render() {


    const {data, filteredData, filterValues, showDetails, selectedPatient, selectedPatientAEs, size} = this.props

    console.log(selectedPatient);

    return <Switch>
      <Route path='/trialData/ae/summary' render={() => <div id="main" className="item-main"><ToxPlotTimeUI data={data} filteredData={filteredData} /></div>}/>
      <Route path='/trialData/ae/table' render={() => <div className="item-main"><div style={{height:30}}></div><ToxTableUI data={data} filteredData={filteredData}/></div>}/>
      <Route path='/trialData/ae/summary_table' render={() => <div className="item-main"><div style={{height:30}}></div><ToxTableSummary data={data} filteredData={filteredData}/></div>}/>
      <Route path='/trialData/ae/cycle_plot' render={() => <div className="item-main"><ToxPlotCycleUI data={data} filteredData={filteredData}/></div>}/>
      <Route path="/trialData/ae/survival" render={() => <ToxPlotKaplan data={data} filteredData={filteredData} />}/>
      <Route path="/trialData/ae/addae" render={() => <ToxAddData data={data} filterValues={filterValues} addAdverseEvent={this.props.addAdverseEvent}/>}/>
      <Route path='/trialData/ae/pt' render={() => <ToxPlotUI
        totalHeight={size.height}
        data={data}
        filteredData={filteredData}
        offset={{top: 0, bottom: 0, left: 10, right: 10}}
        size={size}
        showDetails={showDetails}
        filter={filterValues}
        selectedPatient={selectedPatient}
        selectedPatientAEs={selectedPatientAEs}
        oneRowPerPatient={true} />}/>
      <Route path='/trialData/ae/ae' render={() => <ToxPlotUI
        totalHeight={size.height}
        data={data}
        filteredData={filteredData}
        offset={{top: 0, bottom: 0, left: 10, right: 10}}
        size={size}
        showDetails={showDetails}
        filter={filterValues}
        selectedPatient={selectedPatient}
        selectedPatientAEs={selectedPatientAEs}
        oneRowPerPatient={false} />}/>
        <Route component={Error404}/>
      </Switch>

  }
}


export default AdverseEvents
