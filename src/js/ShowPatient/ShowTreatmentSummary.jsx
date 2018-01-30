import React, { Component } from 'react'
import {formatDate} from '../utils/formatDate'
import "./ShowToxicityRecord.css"
import {uniqBy} from 'lodash'

class ShowTreatmentSummary extends Component {


  /*
     constructor(props){
        super(props)
     }
  */

  render() {
    // receives

    const {data, totalHeight, selectedPatient} = this.props

    if(selectedPatient === null)
      return <div></div>


    console.log(data.treatment);
    console.log(selectedPatient);

    const treatment = data.treatment.find(t => selectedPatient.treatment === t.value)

    const treatmentSpecs = uniqBy(data.treatmentSpecification, t => t.index)

    const rows = treatmentSpecs.map((t,i) => {
      const doseColors = t.doseColors.sort((a,b) => {
        var val = 0
        if(a.value < b.value) {
          val = 1
        } else if(a.value > b.value) {
          val = -1
        }
        return val
      })

      console.log(t);

      const values = data[t.datasetName].filter(p => p.patid == selectedPatient.patid).map(p => doseColors.find(dc =>  p[t.column] >= dc.value).value)


      console.log(values);

      return t.doseColors.map((d,j) => <tr key={`${i},${j}`}>
        {j == 0 ? <td rowSpan={t.doseColors.length}>{t.label}</td>: null}
        <td>{d.label == undefined ? d.value: d.label}</td>
        <td>{values.filter(v => v == d.value).length}</td>
      </tr>)
    })



    return <div
      className="patient-record"
      style={{'backgroundColor': treatment.color + "40", bottom: '0', height: `${totalHeight}px`, overflowX: 'auto', overflowY: 'auto'}}>
      <h3><b>Subject ID:</b> {selectedPatient.patid}</h3>
      <h4><b>Treatment Arm:</b> {treatment.label}</h4>
      <h4><b>{data.keyDates[0].label}:</b> {formatDate(selectedPatient[data.keyDates[0].column])}</h4>
      {rows.length > 0 ? <table className="center">
        <tbody>
          <tr>
            <th>Treatment</th>
            <th>Dose</th>
            <th>Count</th>
          </tr>
          {rows}
        </tbody>
      </table>: null}
    </div>

  }


}

export default ShowTreatmentSummary
