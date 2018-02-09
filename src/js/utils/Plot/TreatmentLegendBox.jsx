import React from 'react'

const TreatmentLegendBox = (props) => {

  const {treatment, svgPosition} = props

  const height = 30

  const rows = treatment.map((t,i) => <g
    key={i}
    transform={`translate(0,${i*height + height/2})`}
  >
    <rect
      x={0}
      y={-height/2}
      width={20}
      height={20}
      fill={t.color}
      fillOpacity={0.3}
      stroke={t.color}
      strokeWidth={2}
      />
    <text
      x={30}
      y={0}
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


TreatmentLegendBox.defaultProps = {
  svgPosition: {top: 50, left: 1200}
}

export default TreatmentLegendBox
