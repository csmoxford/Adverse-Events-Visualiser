import React, { PureComponent } from 'react'
import AdverseEventRow from './AdverseEventRow.jsx'
import "./ShowToxicityRecord.css"
import {formatDate} from '../../utils/formatDate'

class ShowToxicityRecord extends PureComponent {


  /*
     constructor(props){
        super(props)
     }
  */

  render() {
    // receives

    const {data, totalHeight, selectedPatient, thisPatientsAeData} = this.props

    if(selectedPatient === null)
      return <div></div>

    var rows
    if(thisPatientsAeData !== null) {
      rows = thisPatientsAeData.sort(function(a,b) {
         var value = 0
         if(b.aegrade == undefined) {
           value = -1
         }if(a.aegrade == undefined) {
           value = 1
         } else if(a.aegrade < b.aegrade) {
           value = 1
         } else if(a.aegrade > b.aegrade) {
           value = -1
         } else if(a.toxStart > b.toxStart) {
           value = 1
         } else if(a.toxStart < b.toxStart) {
           value = -1
         }
         return value
       }).map((d,i) => {
        return(<AdverseEventRow
          key={'row' + i}
          thisPatientsAeData={d}
          data={data}
          colors={data.toxColors}/>)
      })
    }

    const causality = data.causality.map((c,i) => <th key={i}>{c.label}</th>)
    const treatment = data.treatment.find(t => selectedPatient.treatment === t.value)

    return(
      <div
        className="patient-record"
        style={{'backgroundColor': treatment.color + "40", bottom: '0', height: `${totalHeight}px`, overflowX: 'auto', overflowY: 'auto'}}>
        <h3><b>Subject ID:</b> {selectedPatient.patid}</h3>
        <h4><b>Treatment Arm:</b> {treatment.label}</h4>
        <h4><b>{data.keyDates[0].label}:</b> {formatDate(selectedPatient[data.keyDates[0].column])}</h4>
        {rows.length > 0 ? <table className="center">
          <tbody>
            <tr>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Category</th>
              <th>Adverse Event</th>
              <th>Grade</th>
              {causality}
            </tr>
            {rows}
          </tbody>
        </table> : <p>No adverse event data selected</p>}
      </div>
    )
  }

}


export default ShowToxicityRecord
