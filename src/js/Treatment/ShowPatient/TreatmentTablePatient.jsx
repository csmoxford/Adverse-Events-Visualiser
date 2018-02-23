import React from 'react'
import {uniqBy} from 'lodash'
import {sum} from 'd3-array'


const TreatmentTablePatient = (props) => {

  const {data, selectedPatient} = props

  if(data.treatmentSpecification === undefined) {
    return <div></div>
  }

  const treatmentSpecs = uniqBy(data.treatmentSpecification, t => t.index)

  // only display the table if total treatment received is greater than zero
  var total = 0
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

    const values = data[t.datasetName].filter(p => p.patid === selectedPatient.patid).map(p => doseColors.find(dc =>  p[t.column] >= dc.value).value)
    total += sum(values)

    const numberDoses = t.doseColors.filter((d,j) => values.filter(v => v === d.value).length > 0).length
console.log(numberDoses);
    var k = 0
    return t.doseColors.map((d,j) => {
      if(values.filter(v => v === d.value).length > 0) {
        k++
        return <tr key={`${i},${j}`}>
          {k === 1 ? <td rowSpan={numberDoses}>{t.label}</td>: null}
          <td>{d.label === undefined ? d.value: d.label}</td>
          <td>{values.filter(v => v === d.value).length}</td>
        </tr>
      } else {
        return null
      }
    })
  })

  if(total > 0) {
    return <table className="center">
      <tbody>
        <tr>
          <th>Treatment</th>
          <th>Dose</th>
          <th>Count</th>
        </tr>
        {rows}
      </tbody>
    </table>

  } else {
    return <p>No treatment recorded for patient</p>
  }

}


export default TreatmentTablePatient
