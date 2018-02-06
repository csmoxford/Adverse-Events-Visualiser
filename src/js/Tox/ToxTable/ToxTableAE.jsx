import React from 'react'
import {uniq, uniqBy} from 'lodash'
import {sum} from 'd3-array'
import './ToxTable.css'

function bracketPercent (count = 0, total) {
  if(count === 0)
    return ""
  return `(${Math.round(count/total*100)}%)`
}

const ToxTableAE = (props) => {

  const {data, filteredData, sortFun} = props

  const adverseNames = uniqBy(filteredData.map((d,i) => {return {category: d.aecategory, name: d.aeterm}}), e => e.name)

  if(filteredData.length === 0) {
    return <div><br/>No data was sent. Table could not be plotted.</div>
  }

  const treatments = data.treatment.map(t => t.value)
  const numberOfPatients = treatments.map(t => data.patientData.filter(d => d.treatment === t).length)
  const treatmentUI = data.treatment.map((t,i) => <th key={i} colSpan="2" style={{backgroundColor: t.color + '40'}}>{t.label} (n={numberOfPatients[i]})</th>)
  const aeHeader = data.treatment.map((t,i) => [
    <th key={`${i}_0`} style={{backgroundColor: t.color + '40'}}>Grade 1-5</th>,
      <th key={`${i}_1`} style={{backgroundColor: t.color + '40'}}>Grade 3-5</th>
    ])

    const totals = data.treatment.map((t,j) => {
      const count1 = uniq(filteredData.filter(d => d.treatment === t.value).map(d => d.patid)).length
      const count3 = uniq(filteredData.filter(d => d.treatment === t.value && d.aegrade > 2).map(d => d.patid)).length
      const style = {backgroundColor: t.color + '40'}
      return [
        <td key={`${j}_0`} style={style}>{count1} {bracketPercent(count1,numberOfPatients[j])}</td>,
        <td key={`${j}_1`} style={style}>{count3} {bracketPercent(count3,numberOfPatients[j])}</td>
      ]
    })

  const totalRow = <tr key="total">
    <td colSpan="2"><b>All Adverse Events</b></td>
    {totals}
  </tr>

  const rowData = adverseNames.map((a,i) => {
    const trtData = data.treatment.map((t,j) => {
      const count1 = uniq(filteredData.filter(d => d.aeterm === a.name && d.treatment === t.value).map(d => d.patid)).length
      const count3 = uniq(filteredData.filter(d => d.aeterm === a.name && d.treatment === t.value && d.aegrade > 2).map(d => d.patid)).length
      const style = {backgroundColor: t.color + '40'}
      return {count1: count1, count3: count3}
    })
    const total = {count1: sum(trtData.map(d => d.count1)), count3: sum(trtData.map(d => d.count3))}
    return {category: a.category, name: a.name, treatmentData: trtData, total: total }
  })

  const rows = rowData.sort(sortFun).map((a,i) => {
    const cells = data.treatment.map((t,j) => {
      const style = {backgroundColor: t.color + '40'}
      return [
        <td key={`${j}_0`} style={style}>{a.treatmentData[j].count1} {bracketPercent(a.treatmentData[j].count1,numberOfPatients[j])}</td>,
        <td key={`${j}_1`} style={style}>{a.treatmentData[j].count3} {bracketPercent(a.treatmentData[j].count3,numberOfPatients[j])}</td>
      ]
    })
    return <tr key={i}>
      <td>{a.category}</td>
      <td>{a.name}</td>
      {cells}
    </tr>
  })


  return <table className="toxTable center">
    <tbody>
      <tr>
        <th colSpan="2"></th>
        {treatmentUI}
      </tr>
      <tr>
        <th>Category</th>
        <th>Adverse Event</th>
        {aeHeader}
      </tr>
      {totalRow}
      {rows}
    </tbody>
  </table>
}

ToxTableAE.defaultProps = {
  sortType: "grade3"
}

export default ToxTableAE
