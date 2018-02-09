import React from 'react'
import {PathRect} from './PolylinePaths'

const BarPlotSet = (props) => {
  const {data, xScale, yScale, color} = props

  const rect = data.map((c,j) => <rect
    key={j}
    x={xScale(c.x - 0.5)}
    y={yScale(c.y)}
    width={xScale(1)-xScale(0)}
    height={yScale(0) -yScale(c.y)}
    fill={color}
    fillOpacity={0.3}
    />
  )

    const polyline = <polyline
      points={PathRect(data,xScale, yScale)}
      stroke={color}
      strokeWidth={2}
      fill="none"
      />

  return <g>
    {rect}
    {polyline}
  </g>
}


export default BarPlotSet
