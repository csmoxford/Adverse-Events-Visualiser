import React from 'react'
import { scaleLinear } from 'd3-scale'
import TreatmentLegendBox from '../../utils/Plot/TreatmentLegendBox'

import ToxPlotCycleCreate from './ToxPlotCycleCreate'

function getCountsFromTimePeriods(data, patients, times) {

    return times.map((t,i) => {
      const value = 100*patients.filter(p => data.filter(d => d.patid === p.patid).filter(d => {
        const inTime = !((d.aestartdate < d[t.from] && d.aestopdate < d[t.from]) || (d.aestartdate > d[t.to])) && !isNaN(d[t.from]) // if toxicity was present in time window
        return inTime
      }).length > 0).length / patients.filter(p => !isNaN(p[t.from])).length

      return {
        x: i+0.5,
        y: isNaN(value)? 0 : value
      }
    })
}

const ToxPlotCycle = (props) => {
  const {data, filteredData, oneGraph} = props

  const offset = {top: 20, bottom: 50, left: 50, right: 10}

  if(filteredData.length === 0) {
    return <div><br/>No data was sent. Graph could not be plotted.</div>
  }

  const treatments = data.treatment.map(t => t.value)
  const color = data.treatment.map(t => t.color)

  const size = oneGraph ?{width: 0.8*window.innerWidth, height: 0.86*window.innerHeight} : {width: 0.8*window.innerWidth, height: Math.max(0.86*window.innerHeight/data.treatment.length, window.innerHeight*0.215)}

  const xMin = 0
  const xMax = data.keyDates.length - 1

  const xScale = scaleLinear()
    .domain([xMin, xMax])
    .range([offset.left, size.width - offset.right])


  const fromToColumns = data.keyDates.filter((k,i) => i < (data.keyDates.length-1)).map((t,i) => {

    return {from: t.column, to: data.keyDates[i+1].column}})

  const countData = treatments.map(t => getCountsFromTimePeriods(filteredData.filter(d => d.treatment === t), data.patientData.filter(d => d.treatment === t), fromToColumns))

  const yMin = 0
  const yMax = 100

  const yScale = scaleLinear()
     .domain([yMin,yMax])
     .range([size.height - offset.bottom, offset.top])


  const ticks = data.keyDates.map((c,i) => i)
  const label = data.keyDates.map(c => c.label)

  var graphs;
  if(oneGraph) {
    graphs = <ToxPlotCycleCreate
      countData={countData}
      xScale={xScale}
      yScale={yScale}
      color={color}
      size={size}
      offset={offset}
      ticks={ticks}
      label={label}
      legend={<TreatmentLegendBox
        treatment={data.treatment}
        svgPosition={{left: size.width*0.75, top: offset.top+10}}
        />}
        />

  } else {
    graphs = data.treatment.map((t,i) => <ToxPlotCycleCreate
      key={i}
      countData={countData[i]}
      xScale={xScale}
      yScale={yScale}
      color={t.color}
      size={size}
      offset={offset}
      ticks={ticks}
      label={label}
      legend={<TreatmentLegendBox
        treatment={[data.treatment[i]]}
        svgPosition={{left: size.width*0.75, top: offset.top+10}}
        />}
    />)

  }

  return <div>{graphs}</div>
}

ToxPlotCycle.defaultProps = {
  data: null,
  oneGraph: false
}

export default ToxPlotCycle
