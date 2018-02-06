import React, {PureComponent} from 'react'
import {scaleLinear} from 'd3-scale'
import {max} from 'd3-array'
import {uniqBy} from 'lodash'

import {SingleDateSet, DoubleDateSet} from './TreatmentDateSet'

import Axis from '../../utils/Axis'
import {DayDifference} from '../../utils/formatDate'



class TreatmentPlot extends PureComponent {

  render() {

    const {size, offset, data, treatmentSpecification, selectedPatient} = this.props

    const selectedPatid = selectedPatient != undefined ? selectedPatient.patid: undefined

    const nTreatments = uniqBy(treatmentSpecification, t => t.index).length

    const xMin = 0
    const xMax = 30
    const yMin = -0.5
    const yMax = (nTreatments*data.patientData.length) - 0.5

    const height = 30 * (yMax+0.5)
    const totalHeight = height + offset.top + offset.bottom

    const yScale = scaleLinear()
       .domain([yMin, yMax])
       .range([offset.top, totalHeight - offset.bottom])

    const xScale = this.props.xScale !== undefined ? this.props.xScale: scaleLinear()
      .domain([xMin, xMax])
      .range([offset.left, size.width - offset.right])



      console.log("n patients: " + data.patientData.length);
      console.log("n treatments: " + nTreatments);

    var containsData = false;
    // set this to true if data is prepared for plotting. Otherwise we will return a message instead of the plot.
    const treatmentData = treatmentSpecification.map((t,i) => {

      const patientData = data.patientData.map((p,j) => {



        var readyData = data[t.datasetName].filter(d => d.patid == p.patid)

        if(readyData.length > 0) {
          readyData = readyData.map(d => {

            return {
              x: DayDifference(p[data.keyDates[0].column], new Date(d[t.startDate])),
              x2: DayDifference(p[data.keyDates[0].column],new Date(d[t.endDate])),
              y: d[t.column]}
          })

          containsData = true

          var rect = null
          if(t.type == "Single") {
            rect = <SingleDateSet
              key={i + "," + j}
              treatmentMetadata={t}
              data={readyData}
              xScale={xScale}
              yScale={yScale}
              yPosition={t.index + j * nTreatments}/>
          } else if(t.type == "Double") {
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
        fill={d.patid == selectedPatid ? "#000": color}
        fillOpacity={0.1}
        stroke={color}
        strokeOpacity={0.2}
        onMouseOver={(e) => this.props.showDetails(d,e)}
      />
    </g>
   })


    if(containsData) {
    return <svg width={size.width} height={totalHeight}>
      {treatmentData}
      <g id="treatmentNames">{treatmentNames}</g>
      <g id="treatmentRect">{treatmentRect}</g>
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


TreatmentPlot.defaultProps = {
  size: {width: 800, height: 500},
  offset: {top:50, bottom: 50, left: 50, right: 50}
}

export default TreatmentPlot
