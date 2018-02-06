import React from 'react'
import { scaleLinear } from 'd3-scale'
import { min, max } from 'd3-array'

import Axis from '../../utils/Axis'
import BarPlotSet from '../../utils/BarPlotSet'

const ToxPlotCycleCreate = (props) => {
  const {countData, color, xScale, yScale, offset, size, ticks, label, legend} = props
  var rects
  if(Array.isArray(color)) {
    rects = color.map((c,i) => <BarPlotSet key={i} data={countData[i]} xScale={xScale} yScale={yScale} color={c}/>)
  } else {
    rects = <BarPlotSet data={countData} xScale={xScale} yScale={yScale} color={color}/>
  }


  return <svg
    width={size.width} height={size.height}>
    {rects}
    <Axis
      side="bottom"
      lab="Cycle Time Periods"
      ticks={ticks}
      label={label}
      xScale={xScale}
      yScale={yScale}
      yPos={yScale.range()[0]}
    />
    <Axis
       side="left"
       xScale={xScale}
       yScale={yScale}
       lab="Patients (%)"
     />
   {legend}
     </svg>
}

ToxPlotCycleCreate.defaultProps = {
  data: null,
  legend: null
}

export default ToxPlotCycleCreate
