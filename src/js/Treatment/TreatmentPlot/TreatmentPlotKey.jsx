import React from 'react'
import {uniqBy} from 'lodash'

import {TreatmentKeySingle, TreatmentKeyDouble} from './TreatmentKey'


const TreatmentPlotKey = (props) => {
  const {data} = props

  const uniqueSpec = uniqBy(data.treatmentSpecification, d => d.index)
  var currentPos = 50
  const height = 30
  const keys = uniqueSpec.map((d,i) => {

    const takeupHeight = (d.doseColors.length + 1.5) * height
    const pos = currentPos
    currentPos += takeupHeight

    if(d.type === "Single") {
      return <TreatmentKeySingle key={i} treatment={d} height={height} position={{left: 50, top: pos}}/>
    } else if(d.type === "Double") {
      return <TreatmentKeyDouble key={i} treatment={d} height={height} position={{left: 50, top: pos}}/>
    } else {
      return null
    }
  })

  return <svg width={300} height={currentPos}>
    {keys}
  </svg>
}



export default TreatmentPlotKey
