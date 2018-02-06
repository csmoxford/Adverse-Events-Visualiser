import React, { PureComponent } from 'react'
import {min, max} from 'd3-array'
import { scaleLinear } from 'd3-scale'
import Axis from '../../utils/Axis'
import {uniq} from 'lodash'

import TreatmentPolyLine from '../../utils/TreatmentPolyLine'
import TreatmentLegendLine from '../../utils/TreatmentLegendLine'

import {DayDifference} from '../../utils/formatDate'
import {PathKaplanMeier} from '../../utils/PolylinePaths'


// creates the survival times and event values from the datasets
function GetKaplanMeierData(patientData, filteredData, startColumn, censorColumn) {

  const survivalData = patientData.filter(p => !isNaN(p[startColumn]))
    .map(p => {
      var dta = filteredData.filter(d => d.patid == p.patid)
      if(dta.length == 0) {
        return {time: Math.max(DayDifference(p[startColumn],p[censorColumn]),0), event: false}
      } else {
        return {time: Math.max(min(dta.map(d => d.toxStart)),0), event: true}
      }
    }
  )
  return KaplanMeier(survivalData)
}

// converts exit time and event indicator to the data requried to plot the kaplan-meier
function KaplanMeier(data) {

  var dta = [{x:0, y:100}]

  const times = uniq(data.filter(d => d.event).map(d => d.time)).sort((a,b) => {
    var val = 0
    if(a > b)
      val = 1
    else if(a < b)
      val = -1
    return val
  })


  data.sort((a,b) => {
    var val = 0
    if(a.time > b.time)
      val = 1
    else if(a.time < b.time)
      val = -1
    return val
  })
  var scur = 100
  for (var i = 0; i < times.length; i++) {
    const d = data.filter(d => d.event && d.time == times[i]).length
    const n = data.filter(d => d.time >= times[i]).length
    scur *= 1 - d/n
    dta.push({x: times[i], y: scur})
  }

  dta.push({x: max(data.map(d => d.time)), y: scur})

  return dta
}

const ToxPlotKaplan = (props) => {

  const {data, filteredData} = props

  const offset={top: 30, bottom: 50, left: 50, right: 10}

  var size = {width: 0.8*window.screen.width, height: 0.8*window.screen.height}

  if(filteredData.length === 0) {
    return <div><br/>No data was sent. Graph could not be plotted.</div>
  }

  const treatments = data.treatment.map(t => t.value)
  const color = data.treatment.map(t => t.color)
  const patients = data.patientData.map(d => d.patid)

  const startColumn = data.keyDates[0]
  const censorColumn = data.keyDates[data.keyDates.length - 1]
  const kaplanData = treatments.map(t => GetKaplanMeierData(data.patientData.filter(d => d.treatment == t), filteredData.filter(d => d.treatment == t), startColumn.column, censorColumn.column))


  const xMin = 0
  const xMax = max(kaplanData.map((d) => max(d.map(d => d.x)))) + 1

  const xScale = scaleLinear()
    .domain([xMin, xMax])
    .range([offset.left, size.width - offset.right])

  var times = [xMin]
  var increment = 1
  var current = xMin
  while(current < xMax) {
    current+=increment
    times.push(current)
  }

  const yMin = 0
  const yMax = 100

  const yScale = scaleLinear()
     .domain([yMin,yMax])
     .range([size.height - offset.bottom, offset.top])

  const polylines = kaplanData.map((d,i) =><polyline
    key={i}
    points={PathKaplanMeier(d,xScale, yScale)}
    stroke={color[i]}
    strokeWidth={2}
    fill="none"
    />)

  return <svg
    width={size.width} height={size.height}>
    {polylines}
    <Axis
      side="bottom"
      lab="Time (days)"
      xScale={xScale}
      yScale={yScale}
      yPos={yScale(yMin)}
    />
    <Axis
       side="left"
       xScale={xScale}
       yScale={yScale}
       lab="Patients (%)"
     />
   <TreatmentLegendLine
     treatment={data.treatment}/>
     </svg>

}


export default ToxPlotKaplan
