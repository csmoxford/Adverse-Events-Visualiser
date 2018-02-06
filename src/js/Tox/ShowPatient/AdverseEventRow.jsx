import React from 'react'
import './AdverseEventRow.css'
import {formatDate} from '../../utils/formatDate'
import {defaultToxColors} from '../../utils/Constants'

const causalityLabels = ["", "Not related", "Unlikely related", "Possibly related", "Probably related", "Definitely related"]


const AdverseEventRow = (props) => {
  const {data, thisPatientsAeData} = props

  const causality = data.causality.map((c,i) => <td key={i}>{causalityLabels[thisPatientsAeData[c.column]]}</td>)

  return(
    <tr style={{ backgroundColor: props.colors[thisPatientsAeData.aegrade]}}>
      <td>{formatDate(thisPatientsAeData.aestartdate)}</td>
      <td>{formatDate(thisPatientsAeData.aestopdate)}</td>
      <td>{thisPatientsAeData.aecategory}</td>
      <td>{thisPatientsAeData.aeterm}</td>
      <td>{thisPatientsAeData.aegrade}</td>
      {causality}
    </tr>
  )
}

AdverseEventRow.defaultProps = {
  colors: defaultToxColors
}

export default AdverseEventRow
