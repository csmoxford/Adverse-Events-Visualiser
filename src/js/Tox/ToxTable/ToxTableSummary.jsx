import React from 'react'
import {uniq} from 'lodash'
import './ToxTable.css'
import {bracketPercent} from '../../utils/FormatNumber'

const ToxTable = (props) => {
  const {data, filteredData} = this.props

  if(filteredData.length === 0) {
    return <div><br/>No data was sent. Table could not be plotted.</div>
  }

  const treatments = data.treatment.map(t => t.value)
  const numberOfPatients = treatments.map(t => data.patientData.filter(d => d.treatment === t).length)

  const treatmentUI = data.treatment.map((t,i) => <th key={i} colSpan="3" style={{backgroundColor: t.color + '40', paddingLeft: 5, paddingRight: 5}}>{t.label} (n={numberOfPatients[i]})</th>)
  const aeHeader = data.treatment.map((t,i) => [
    <th key={`${i}_0`} style={{backgroundColor: t.color + '40'}}>n</th>,
    <th key={`${i}_1`} style={{backgroundColor: t.color + '40'}}>Grade 1-5</th>,
      <th key={`${i}_2`} style={{backgroundColor: t.color + '40'}}>Grade 3-5</th>
    ])

  // foreach tableRow (time period)
  const rows = data.keyDates.filter((k,i) => i !== (data.keyDates.length-1)).map((k,i) => {

    const fromColumn = k.column
    const toColumn = data.keyDates[i+1].column

    // for each treatment, create two columns
    const cells = data.treatment.map((t,j) => {
      // column 1 numerator (grade 1-5)
      const count1 = uniq(filteredData.filter(d => {
        const inTime = !((d.aestartdate < d[fromColumn] && d.aestopdate < d[fromColumn]) || (d.aestartdate > d[toColumn])) && !isNaN(d[fromColumn])
        return d.treatment === t.value && inTime
      } ).map(d => d.patid)).length

      // column 2 numerator (grade 3-5)
      const count3 = uniq(filteredData.filter(d => {
        const inTime = !((d.aestartdate < d[fromColumn] && d.aestopdate < d[fromColumn]) || (d.aestartdate > d[toColumn])) && !isNaN(d[fromColumn])
        return d.treatment === t.value && inTime  && d.aegrade > 2
      } ).map(d => d.patid)).length

      // denominator (patients present in cycle)
      const countAll = data.patientData.filter(d => d.treatment === t.value && !isNaN(d[fromColumn])).length


      const style = {backgroundColor: t.color + '40'}
      return [
        <td key={`${j}_0`} style={style}>{countAll}</td>,
        <td key={`${j}_1`} style={style}>{count1} {bracketPercent(count1,countAll)}</td>,
        <td key={`${j}_2`} style={style}>{count3} {bracketPercent(count3,countAll)}</td>
      ]
    })

    return <tr key={i}>
      <td>{k.label}</td>
      {cells}
    </tr>

  })

  return <table className="toxTable center">
    <tbody>
      <tr>
        <th></th>
        {treatmentUI}
      </tr>
      <tr>
        <th>Adverse Event</th>
        {aeHeader}
      </tr>
      {rows}
    </tbody>
  </table>
 }



export default ToxTable
