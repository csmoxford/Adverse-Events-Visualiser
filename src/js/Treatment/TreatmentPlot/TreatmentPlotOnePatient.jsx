import React from 'react'
import {scaleLinear} from 'd3-scale'
import {max} from 'd3-array'
import {uniqBy} from 'lodash'

import {SingleDateSet, DoubleDateSet} from './TreatmentDateSet'

import Axis from '../../utils/Plot/Axis'
import {DayDifference} from '../../utils/formatDate'



const TreatmentPlotOnePatient = (props) => {

  const {size, offset, filter, data, patid} = props


  const xMin = 0
  const xMax = 30
  const yMin = -0.5
  const yMax = max(data.treatmentSpecification.map(t => t.index)) + 0.5

  const height = 30 * (yMax+0.5)
  const totalHeight = height + offset.top + offset.bottom

  const yScale = scaleLinear()
     .domain([yMin, yMax])
     .range([offset.top, totalHeight - offset.bottom])

  const xScale = props.xScale !== undefined ? props.xScale: scaleLinear()
    .domain([xMin, xMax])
    .range([offset.left, size.width - offset.right])

    const patient = data.patientData.find(p => p.patid === patid)



  var containsData = false;
  // set this to true if data is prepared for plotting. Otherwise we will return a message instead of the plot.
  const treatmentRects = data.treatmentSpecification.map((t,i) => {

    var readyData = data[t.datasetName].filter(d => d.patid === patid)

    if(readyData.length > 0) {
      readyData = readyData.map(d => {
        return {
          x: DayDifference(patient[filter.from], new Date(d[t.startDate])),
          x2: DayDifference(patient[filter.from],new Date(d[t.endDate])),
          y: d[t.column]}
      })

      containsData = true

      var rect = null
      if(t.type === "Single") {
        rect = <SingleDateSet
          key={`s_${i}`}
          treatmentMetadata={t}
          data={readyData}
          xScale={xScale}
          yScale={yScale}
          yPosition={t.index}/>
      } else if(t.type === "Double") {
        rect = <DoubleDateSet
          key={`d_${i}`}
          treatmentMetadata={t}
          data={readyData}
          xScale={xScale}
          yScale={yScale}
          yPosition={t.index}/>
      } else {
        console.log("Type not matched for treatment metadata entry (" + i + ")");
      }
      return rect
    } else {
      return null
    }
  })

  const treatmentNames = uniqBy(data.treatmentSpecification, d => d.index).map((t,i) => {
    return <text
      key={i}
      x={xScale.range()[1] - 5}
      y={yScale(t.index)}
      dominantBaseline="central"
      textAnchor="end"
      >{t.label}</text>
  })


  if(containsData) {
    return <svg width={size.width} height={totalHeight}>
      {treatmentRects}
      <g id="treatmentNames">{treatmentNames}</g>
      <Axis
        side="bottom"
        lab={`Time (days from ${filter.fromLabel})`}
        xScale={xScale}
        yScale={yScale}
      />

    </svg>
  } else {
    return <div><p>This patient has no treatment data recorded.</p></div>
  }
}


TreatmentPlotOnePatient.defaultProps = {
  size: {width: 1000, height: 500},
  offset: {top:10, bottom: 50, left: 50, right: 50}
}

export default TreatmentPlotOnePatient
