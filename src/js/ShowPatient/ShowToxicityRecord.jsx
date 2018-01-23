import React, { Component } from 'react'
import AdverseEventRow from './AdverseEventRow.jsx'
import "./ShowToxicityRecord.css"
import {formatDate} from '../utils/formatDate'

class ShowToxicityRecord extends Component {


  /*
     constructor(props){
        super(props)
     }
  */

  render() {
    // receives

    const {data, totalHeight, thisData} = this.props


    if(thisData === null)
      return <div></div>

    const rows = thisData !== null?
     thisData.sort(function(a,b) {
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
        thisData={d}
        data={data}/>)
    }): ""

    const causality = data.causality.map((c,i) => <th key={i}>{c.label}</th>)
    const treatment = data.treatment.find(t => thisData[0].treatment === t.value)

    const patid = thisData[0].patid
    const patientData = data.patientData.find(p => p.patid == patid)

    return(
      <div
        className="patient-toxicity-record"
        style={{'backgroundColor': treatment.color + "40", bottom: '0', height: `${totalHeight}px`, overflowX: 'auto', overflowY: 'auto'}}>
        <h3><b>Subject ID:</b> {patid}</h3>
        <h4><b>Treatment Arm:</b> {treatment.label}</h4>
        <h4><b>{data.keyDates[0].label}:</b> {formatDate(patientData[data.keyDates[0].column])}</h4>
        <table className="center">
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
        </table>
      </div>
    )
  }

}


export default ShowToxicityRecord
