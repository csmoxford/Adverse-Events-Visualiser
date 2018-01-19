import React, { PureComponent } from 'react'
import { scaleLinear } from 'd3-scale'
import { min, max } from 'd3-array'
import Axis from './utils/Axis'
import {uniq} from 'lodash'
import ToxPlotTimeCreate from './ToxPlotTimeCreate'
import TreatmentLegendBox from './utils/TreatmentLegendBox'

function getCounts(data, patients, times) {
    return times.map((t) => {
      return {
        x: t,
        y: 100*patients.filter(p => data.filter(d => d.patid === p.patid).filter(d => d.toxStart <= t && d.toxEnd >= t).length > 0).length / patients.filter(p => d => p.registration <= t && p.eot >= t).length
      }
    })
}

class ToxPlotTime extends PureComponent {


  render() {
    const {data, parentID, filteredData, oneGraph, xMax} = this.props

    const offset={top: 30, bottom: 50, left: 50, right: 20}

    const size = oneGraph ?{width: 0.8*window.innerWidth, height: 0.82*window.innerHeight} : {width: 0.8*window.innerWidth, height: Math.max(0.82*window.innerHeight/data.treatment.length, window.innerHeight*0.205)}

    if(filteredData.length === 0) {
      return <div><br/>No data was sent. Graph could not be plotted.</div>
    }

    const treatments = data.treatment.map(t => t.value)
    const color = data.treatment.map(t => t.color)
    const patients = data.patientData.map(d => d.patid)


    const xMin = 0
    // const xMax = max(filteredData.map((d) => d.toxEnd)) + 1

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


    const countData = treatments.map(t => getCounts(filteredData.filter(d => d.treatment === t), data.patientData.filter(d => d.treatment === t), times))

    const yMin = 0
    const yMax = 100

    const yScale = scaleLinear()
       .domain([yMin,yMax])
       .range([size.height - offset.bottom, offset.top])



     var graphs;
     if(oneGraph) {
       graphs = <ToxPlotTimeCreate
         countData={countData}
         xScale={xScale}
         yScale={yScale}
         color={color}
         size={size}
         offset={offset}
         legend={<TreatmentLegendBox
           treatment={data.treatment}
           svgPosition={{left: size.width*0.75, top: offset.top+10}}
           />}
           />

     } else {
       graphs = data.treatment.map((t,i) => <ToxPlotTimeCreate
         countData={countData[i]}
         xScale={xScale}
         yScale={yScale}
         color={t.color}
         size={size}
         offset={offset}
         legend={<TreatmentLegendBox
           treatment={[data.treatment[i]]}
           svgPosition={{left: size.width*0.75, top: offset.top+10}}
           />}
       />)
     }

    return <div>{graphs}</div>
  }
}

ToxPlotTime.defaultProps = {
  data: null,
  oneGraph: false
}

export default ToxPlotTime
