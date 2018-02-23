import React from 'react'
import {scaleLinear} from 'd3-scale'
import {uniqBy} from 'lodash'
import {max} from 'd3-array'

import {SingleDateSet, DoubleDateSet} from './TreatmentDateSet'

import Axis from '../../utils/Plot/Axis'
import {DayDifference} from '../../utils/formatDate'

import EventPolyline from '../../utils/Plot/EventPolyline'


const TreatmentPlot = (props) => {

  const {size, offset, data, filter, treatmentSpecification, selectedPatient} = props

  const selectedPatid = selectedPatient !== null ? selectedPatient.patid: undefined

  const nTreatments = uniqBy(treatmentSpecification, t => t.index).length

  const heightDiv = props.totalHeight - 80

  const xMin = 0
  var xMax = 4 + max(data.patientData.map(d => {
    var diff = DayDifference(d[filter.from], d[filter.to])
    if(!isNaN(diff)) {
      return diff
    } else {
      return null
    }
  }))

  treatmentSpecification.map((t,i) => {

    var readyData = data[t.datasetName]
    if(readyData.length > 0) {
      var val = max(data[t.datasetName].map(d => {
        var patient = data.patientData.find(p => p.patid == d.patid)
        return DayDifference(patient[filter.from], new Date(d[t.startDate]))
      }))

      if(val > xMax) {
        xMax = val + 2
      }
    }
  })

  const yMin = -0.5
  const yMax = (nTreatments*data.patientData.length) - 0.5

  const height = 30 * (yMax+0.5)
  const totalHeight = height + offset.top + offset.bottom

  const yScale = scaleLinear()
     .domain([yMin, yMax])
     .range([offset.top, totalHeight - offset.bottom])

  const xScale = props.xScale !== undefined ? props.xScale: scaleLinear()
    .domain([xMin, xMax])
    .range([offset.left, size.width - offset.right])



  //console.log("n patients: " + data.patientData.length);
  //console.log("n treatments: " + nTreatments);

  var containsData = false;
  // set this to true if data is prepared for plotting. Otherwise we will return a message instead of the plot.


  const treatmentData = treatmentSpecification.map((t,i) => {

    const patientData = data.patientData.map((p,j) => {

      var readyData = data[t.datasetName].filter(d => d.patid === p.patid)
      if(readyData.length > 0) {
        readyData = readyData.map(d => {
          const patient = data.patientData.find(p => p.patid === d.patid)
          return {
            x: DayDifference(patient[filter.from], new Date(d[t.startDate])),
            x2: DayDifference(patient[filter.from],new Date(d[t.endDate])),
            y: d[t.column]}
        })

        containsData = true
        var rect = null
        if(t.type === "Single") {
          rect = <SingleDateSet
            key={i + "," + j}
            treatmentMetadata={t}
            data={readyData}
            xScale={xScale}
            yScale={yScale}
            yPosition={t.index + j * nTreatments}/>
        } else if(t.type === "Double") {
          rect = <DoubleDateSet
            key={i + "," + j}
            treatmentMetadata={t}
            data={readyData}
            xScale={xScale}
            yScale={yScale}
            yPosition={t.index + j * nTreatments}/>
        } else {
          console.log("Type not matched for treatment metadata entry (" + i + ")");
        }
        return rect
      } else {
        return null
      }
    })

    return <g key={i} id={t.column}>{patientData}</g>
  })

  const treatmentNames = uniqBy(treatmentSpecification, d => d.index).map((t,i) => {
    return data.patientData.map((p,j) => <text
      key={`${i},${j}`}
      x={xScale.range()[1] - 5}
      y={yScale(i + j*nTreatments)}
      dominantBaseline="central"
      textAnchor="end"
      >{t.label}</text>)
  })


  const treatmentRect = data.patientData.map((d,i) => {
      const color = data.treatment.find(t => t.value === d.treatment).color
      return <g key={d.patid}><rect
        x={xScale(xMin)}
        y={yScale(i*nTreatments - 0.5)}
        height={yScale(nTreatments) - yScale(0)}
        width={xScale(xMax)-xScale(xMin)}
        fill={d.patid === selectedPatid ? "#000": color}
        fillOpacity={0.1}
        stroke={color}
        strokeOpacity={0.2}
        onMouseEnter={(e) => props.showDetails(d,e)}
      />
    </g>
   })



   var events = null
   /*
   if(data.keyEvents !== undefined) {

     const uniquePositions = data.patientData.map((p,i) => {
       return {patid: p.patid, treatment: p.treatment, min: i, max: i, mid: i}
     })

     events = data.keyEvents.map((e,i) => {
       const event = <EventPolyline
         key={i}
         data={data}
         uniquePositions={uniquePositions}
         filter={filter}
         event={e}
         xScale={xScale}
         yScale={yScale}
         offset={0}/>

       return <g key={i} id={e.column}>{event}</g>

     })
   }
   */

  if(containsData) {
  return [<div key='axis' align="right"><svg
  style={{verticalAlign: "bottom", marginRight: height < heightDiv ? "0px": "17px"}}
  width={size.width}
  height="80px">
  <Axis
    side="top"
    lab={`Time (days ${filter.fromLabel})`}
    xScale={xScale}
    yPos={80}
  /></svg></div>,
  <div
    style={{height: `${heightDiv}px`, bottom: '0', right: '0',overflowY: 'auto', overflowX: 'hidden'}}>
    <svg width={size.width}
    height={totalHeight}>
    {treatmentData}
    {events}
    <g id="treatmentNames">{treatmentNames}</g>
    <g id="treatmentRect">{treatmentRect}</g>
    </svg>
  </div>]
  } else {
    return <div><p>This patient has no treatment data recorded.</p></div>
  }

}




TreatmentPlot.defaultProps = {
  size: {width: 800, height: 500},
  offset: {top:0, bottom: 0, left: 10, right: 10}
}

export default TreatmentPlot
