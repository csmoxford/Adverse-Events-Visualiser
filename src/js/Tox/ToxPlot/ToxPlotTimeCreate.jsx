import React from 'react'
import Axis from '../../utils/Plot/Axis'
import TreatmentPolyLine from '../../utils/Plot/TreatmentPolyLine'

const ToxPlotTimeCreate = (props) => {

  const {countData, color, xScale, yScale, size, legend} = props

  var plines
  if(Array.isArray(color)) {
    plines = countData.map((d,i) => <TreatmentPolyLine
      key={i}
      data={d}
      color={color[i]}
      xScale={xScale}
      yScale={yScale}
      yMin={0}
    />)
  } else {
    plines = <TreatmentPolyLine
      key={0}
      data={countData}
      color={color}
      xScale={xScale}
      yScale={yScale}
      yMin={0}
    />
  }

    return <svg
      width={size.width} height={size.height}>
      {plines}
      <Axis
        side="bottom"
        lab="Time (days)"
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

ToxPlotTimeCreate.defaultProps = {
  data: null,
  legend: null
}

export default ToxPlotTimeCreate
