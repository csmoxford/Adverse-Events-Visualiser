import React, { Component } from 'react'
import './AdverseEventRow.css'
import {formatDate} from '../utils/formatDate'
import {defaultToxColors} from '../utils/Constants'

const causalityLabels = ["", "Not related", "Unlikely related", "Possibly related", "Probably related", "Definitely related"]


const AdverseEventRow = (props) => {
  const {data, thisData} = props

  const causality = data.causality.map((c,i) => <td key={i}>{causalityLabels[thisData[c.column]]}</td>)

  return(
    <tr style={{ backgroundColor: props.colors[thisData.aegrade]}}>
      <td>{formatDate(thisData.aestartdate)}</td>
      <td>{formatDate(thisData.aestopdate)}</td>
      <td>{thisData.aecategory}</td>
      <td>{thisData.aeterm}</td>
      <td>{thisData.aegrade}</td>
      {causality}
    </tr>
  )
}

AdverseEventRow.defaultProps = {
  colors: defaultToxColors
}

export default AdverseEventRow
