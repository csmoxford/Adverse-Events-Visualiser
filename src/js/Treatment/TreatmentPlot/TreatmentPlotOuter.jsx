import React  from 'react'
import TreatmentPlotUI from './TreatmentPlotUI'
import TreatmentPlotKey from './TreatmentPlotKey'
import ShowTreatmentSummary from '../ShowPatient/ShowTreatmentSummary'


const TreatmentPlotOuter = (props) => {
  const {data, totalHeight, filter, size, selectedPatient, showDetails} = props

  return [
    <div className="item-left" key={0}>
      <TreatmentPlotKey
        data={data}
        />
    </div>,
    <div className="item-middle" key={1}>
      <TreatmentPlotUI
        data={data}
        filter={filter}
        size={size}
        showDetails={showDetails}
        totalHeight={totalHeight}
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

export default TreatmentPlotOuter
