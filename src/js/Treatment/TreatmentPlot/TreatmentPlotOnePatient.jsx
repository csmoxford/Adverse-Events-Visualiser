import React, {PureComponent} from 'react'
import {scaleLinear} from 'd3-scale'
import {max} from 'd3-array'
import {uniqBy} from 'lodash'

import {SingleDateSet, DoubleDateSet} from './TreatmentDateSet'

import Axis from '../../utils/Axis'
import {DayDifference} from '../../utils/formatDate'



class TreatmentPlotOnePatient extends PureComponent {

  render() {

    const {size, offset, data, patid} = this.props


    const xMin = 0
    const xMax = 30
    const yMin = -0.5
    const yMax = max(data.treatmentSpecification.map(t => t.index)) + 0.5

    const height = 30 * (yMax+0.5)
    const totalHeight = height + offset.top + offset.bottom

    const yScale = scaleLinear()
       .domain([yMin, yMax])
       .range([offset.top, totalHeight - offset.bottom])

    const xScale = this.props.xScale !== undefined ? this.props.xScale: scaleLinear()
      .domain([xMin, xMax])
      .range([offset.left, size.width - offset.right])

      const patient = data.patientData.find(p => p.patid == patid)



    var containsData = false;
    // set this to true if data is prepared for plotting. Otherwise we will return a message instead of the plot.
    const treatmentRects = data.treatmentSpecification.map((t,i) => {

      var readyData = data[t.datasetName].filter(d => d.patid == patid)

      if(readyData.length > 0) {
        readyData = readyData.map(d => {
          console.log(patient);


          return {
            x: DayDifference(patient[data.keyDates[0].column], new Date(d[t.startDate])),
            x2: DayDifference(patient[data.keyDates[0].column],new Date(d[t.endDate])),
            y: d[t.column]}
        })

        containsData = true

        var rect = null
        if(t.type == "Single") {
          rect = <SingleDateSet
            key={i}
            treatmentMetadata={t}
            data={readyData}
            xScale={xScale}
            yScale={yScale}
            yPosition={t.index}/>
        } else if(t.type == "Double") {
          rect = <DoubleDateSet
            key={i}
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

    console.log(xScale.range()[1]);

    const treatmentNames = uniqBy(data.treatmentSpecification, d => d.index).map((t,i) => {
      return <text
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
        lab="Time (days)"
        xScale={xScale}
        yScale={yScale}
      />

    </svg>
  } else {
    return <div><p>This patient has no treatment data recorded.</p></div>
  }

  }


}


TreatmentPlotOnePatient.defaultProps = {
  size: {width: 1000, height: 500},
  offset: {top:10, bottom: 50, left: 50, right: 50}
}

export default TreatmentPlotOnePatient
