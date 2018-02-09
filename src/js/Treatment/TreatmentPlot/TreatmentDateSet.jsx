import React from 'react'


const SingleDateSet = (props) => {
  const{treatmentMetadata, data, xScale, yScale, yPosition} = props

  const doseColors = treatmentMetadata.doseColors.sort((a,b) => {
    var val = 0
    if(a.value < b.value) {
      val = 1
    } else if(a.value > b.value) {
      val = -1
    }
    return val
  })

  const lines = data.map((d,i) => <polyline
    key={i}
    points={`${xScale(d.x)},${yScale(yPosition - 0.4)}, ${xScale(d.x)},${yScale(yPosition + 0.4)}`}
    stroke={doseColors.find(c => d.y >= c.value).color}
    strokeWidth={4}
    strokeLinecap="round"
  />)

  return <g className="treatment">{lines}</g>
}


const DoubleDateSet = (props) => {
  const{treatmentMetadata, data, xScale, yScale, yPosition} = props

  const doseColors = treatmentMetadata.doseColors.sort((a,b) => {
    var val = 0
    if(a.value < b.value) {
      val = 1
    } else if(a.value > b.value) {
      val = -1
    }
    return val
  })

  const partialHeight = 0.33

  const lines = data.map((d,i) => <polyline
    key={i}
    points={`${xScale(d.x)},${yScale(yPosition - partialHeight)}, ${xScale(d.x)},${yScale(yPosition + partialHeight)} ${xScale(d.x2)},${yScale(yPosition + partialHeight)}, ${xScale(d.x2)},${yScale(yPosition - partialHeight)}`}
    fill={doseColors.find(c => d.y >= c.value).color}
    strokeLinecap="round"
  />)

  return <g className="treatment">{lines}</g>
}



export {SingleDateSet, DoubleDateSet}
