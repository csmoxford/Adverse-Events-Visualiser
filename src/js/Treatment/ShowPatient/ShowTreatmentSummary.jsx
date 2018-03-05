import React, { PureComponent } from 'react'


import {formatDate} from '../../utils/formatDate'
import getTreatment from '../../utils/getTreatment'

import TreatmentTablePatient from './TreatmentTablePatient'

class ShowTreatmentSummary extends PureComponent {

  render() {
    // receives

    const {data, totalHeight, selectedPatient} = this.props

    if(selectedPatient === null) {
      return <div></div>
    }

    const treatment = getTreatment(data.treatment, selectedPatient)

    return <div
      className="patient-record"
      style={{'backgroundColor': treatment.color + "40", bottom: '0', height: `${totalHeight}px`, overflowX: 'auto', overflowY: 'auto'}}>
      <h3><b>Subject ID:</b> {selectedPatient.patid}</h3>
      <h4><b>Treatment Arm:</b> {treatment.label}</h4>
      <h4><b>{data.keyDates[0].label}:</b> {formatDate(selectedPatient[data.keyDates[0].column])}</h4>
      <TreatmentTablePatient data={data} selectedPatient={selectedPatient}/>
    </div>

  }


}

export default ShowTreatmentSummary
