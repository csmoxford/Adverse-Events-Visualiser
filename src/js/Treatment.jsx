import React, {Component}  from 'react'
import TreatmentPlotUI from './TreatmentPlot/TreatmentPlotUI'
import TreatmentPlotKey from './TreatmentPlot/TreatmentPlotKey'
import ShowTreatmentSummary from './ShowPatient/ShowTreatmentSummary'


class Treatment extends Component {


  render() {

    const {data, totalHeight, selectedPatient, showDetails} = this.props

    return [
      <div className="item-left" key={0}>
        <TreatmentPlotKey
          data={data}
          />
      </div>,
      <div className="item-middle" key={1}>
        <TreatmentPlotUI
          data={data}
          showDetails={showDetails}
          selectedPatient={selectedPatient}
          />
      </div>,
      <div className="item-right" key={2}>
        <ShowTreatmentSummary
          data={data}
          totalHeight={totalHeight}
          selectedPatient={selectedPatient}/>
      </div>]
  }

}

export default Treatment
