import React, { Component } from 'react'
import {PathYAxis, PathLine} from './PolylinePaths'

const TreatmentPolyLine = (props) => {

  const {data, color, xScale, yScale, yMin} = props

  return <g>
    <polyline
      points={PathYAxis(data,xScale,yScale,yMin)}
      fill={color}
      fillOpacity={0.3}
      stroke={color}
      strokeWidth={2}
      />
  </g>
}


TreatmentPolyLine.defaultProps = {
  yMin: 0,
  color: "#0000FF"
}

export default TreatmentPolyLine
