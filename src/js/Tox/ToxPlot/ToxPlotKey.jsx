import React from 'react'
import TreatmentLegendBox from '../../utils/TreatmentLegendBox'
import {uniqBy} from 'lodash'
import {defaultToxColors} from '../../utils/Constants'

const AdverseEventLegend = (props) => {
  const {svgPosition} = props

  const colors = [1,2,3,4,5].map(c => props.colors[c])
  const height = 30
  const rows = colors.map((c,i) => <g
    key={i}
    transform={`translate(0,${i*height + height/2})`}>
    <rect
      x={0}
      y={-height/2}
      width={40}
      height={20}
      fill={c}
      />
    <text
      x={50}
      y={0}
      >
      {`Grade ${i+1}`}
    </text>
  </g>)

  return <g
    id="AdverseEventLegend"
    transform={`translate(${svgPosition.left},${svgPosition.top})`}>
    {rows}
  </g>

}
AdverseEventLegend.defaultProps = {
  svgPosition: {top: 50, left: 1200},
  colors: defaultToxColors
}


const Duration = (props) => {

  const dist = 8
  const width = 40

  return <g transform={`translate(${props.svgPosition.left},${props.svgPosition.top})`}>
    <polyline
      points={`0,0 ${width},0`}
      stroke="#000"
      strokeWidth={3}/>
    <polyline
      points={`${width-dist},-${dist} ${width},0 ${width-dist},${dist}`}
      stroke="#000"
      fillOpacity="0"
      strokeWidth={3}/>
    <polyline
      points={`${dist},-${dist} 0,0 ${dist},${dist}`}
      stroke="#000"
      fillOpacity="0"
      strokeWidth={3}/>
    <text
      x={15}
      y={20}
      textAnchor="middle"
      >Duration</text>
  </g>
}


const EventKey = (props) => {

  const {keyEvents, svgPosition} = props

  const uniqeuEvents = uniqBy(keyEvents, e => e.label)
  const events = uniqeuEvents.map((e,i) => <g key={i} transform={`translate(${i},${i*30})`}>
      <polyline
        points={`10,10 10,-10`}
        stroke={e.color}
        strokeWidth={3}
        />
      <text
        x={30}
        y={0}
        dominantBaseline="middle"
        >{e.label}</text>
    </g>)

  return <g transform={`translate(${svgPosition.left},${svgPosition.top})`}>
    {events}
  </g>
}

const ToxPlotKey = (props) => {

  const{ width, data} = props

  const events = data.keyEvents !== undefined ? <EventKey keyEvents={data.keyEvents} svgPosition={{top: 260 + 30*data.treatment.length, left: 55}}/> : null
  const height = 240 + 30*data.treatment.length + 30*(data.keyEvents !== undefined? data.keyEvents.length: 0)

  return <svg
    width={width} height={height}>
    <AdverseEventLegend
      svgPosition={{top: 50, left: 45}}/>
    <Duration
      svgPosition={{top: 50+30*5, left: 45}}
      />
    <TreatmentLegendBox
      treatment={data.treatment}
      svgPosition={{top: 240, left: 55}}/>
    {events}
  </svg>
}



export default ToxPlotKey
