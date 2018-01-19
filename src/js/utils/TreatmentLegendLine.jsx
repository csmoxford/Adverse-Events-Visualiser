import React from 'react'

const TreatmentLegendLine = (props) => {

  const {treatment, svgPosition} = props
  const height = 30
  const rows = treatment.map((t,i) => <g
    key={i}
    transform={`translate(0,${i*height + height/2})`}
  >
    <line
      x1={-20}
      y1={0}
      x2={20}
      y2={0}
      stroke={t.color}
      strokeWidth={2}
      />
    <text
      x={30}
      y={0}
      dominantBaseline="middle"
      >
      {t.label}
    </text>

  </g>)

  return <g
    id="TreatmentLegend"
    transform={`translate(${svgPosition.left},${svgPosition.top})`}>
    {rows}
  </g>

}


TreatmentLegendLine.defaultProps = {
  svgPosition: {top: 50, left: 1200}
}

export default TreatmentLegendLine
