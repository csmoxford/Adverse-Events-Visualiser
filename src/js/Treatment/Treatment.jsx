import React, {Component}  from 'react'

import TreatmentPlotOuter from './TreatmentPlot/TreatmentPlotOuter'



class Treatment extends Component {



  render() {

    const {data, totalHeight, showDetails, selectedPatient} = this.props

    return <TreatmentPlotOuter  data={data} totalHeight={totalHeight} showDetails={showDetails} selectedPatient={selectedPatient} />

  }
}


export default Treatment
