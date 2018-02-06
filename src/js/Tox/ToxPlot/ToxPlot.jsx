import React, {PureComponent } from 'react'
import { scaleLinear } from 'd3-scale'
import { min, max } from 'd3-array'
import {uniq, uniqBy} from 'lodash'

import Axis from '../../utils/Axis.jsx'
import EventPolyline from '../../utils/EventPolyline'

import AdverseEventRect from './AdverseEventRect'
import AdverseEventLabels from './AdverseEventLabels'



class ToxPlot extends PureComponent {

  componentWillUnmount() {
    console.log("don't unmount");
  }

  getIndex(data, oneRowPerPatient = false) {

    var numberUnique = -1
    for (var i = 0; i < data.length; i++) {
      var isNew = true
      var j = 0
      while(isNew && j<i) {
        if(data[i].patid === data[j].patid && (data[i].aeterm === data[j].aeterm || oneRowPerPatient))
          isNew = false
        j++
      }
      if(isNew) {
        numberUnique++
      }
      data[i].index = numberUnique
    }
  }


  render() {
    const {size, data, filteredData, totalHeight, selectedPatient, offset, filter, oneRowPerPatient} = this.props

    if(filteredData.length === 0) {
      return <div><br/>No data was sent. Graph could not be plotted.</div>
    }

    this.getIndex(filteredData, oneRowPerPatient)

    const selectedPatid = selectedPatient === null ? undefined:  selectedPatient.patid

    const xMin = 0
    const xMax = max(filteredData.map((d) => d.toxEnd)) + 1
    const yMin = min(filteredData.map((d) => d.index)) - 0.5
    const yMax = max(filteredData.map((d) => d.index)) + 0.5

    const height = 30 * (max(filteredData.map(d => d.index))+1) + offset.top + offset.bottom
    const heightDiv = totalHeight - 80

    const yScale = scaleLinear()
       .domain([yMin, yMax])
       .range([0, height])
    const xScale = scaleLinear()
      .domain([xMin, xMax])
      .range([offset.left, size.width - offset.right])


      const uniquePatid = uniq(filteredData.map(d => d.patid))
      const uniquePositions = uniquePatid.map((d) => {
        const vals = filteredData.filter(dx => dx.patid === d).map(dx => dx.index)
        const mn = min(vals)
        const mx = max(vals)
        return {patid: d, treatment: filteredData.find(dx => dx.patid === d).treatment, min: mn, max: mx, mid: (mn+mx)/2}
      })


      const backgroundRect = uniquePositions
         .map((d,i) => {
         return <g key={d.patid}><rect
           x={xScale(xMin)}
           y={yScale(d.min - 0.5)}
           height={yScale(d.max + 0.5) - yScale(d.min - 0.5)}
           width={xScale(xMax)-xScale(xMin)}
           fill={d.patid === selectedPatid ? "#000": data.treatment.find(t => t.value === d.treatment).color}
           fillOpacity={0.1}
           stroke={data.treatment.find(t => t.value === d.treatment).color}
           strokeOpacity={0.2}
           onMouseOver={(e) => this.props.showDetails(data.patientData.find(p => d.patid === p.patid),e)}
         />
       {names}
       </g>
     })



     var names = null

     if(!oneRowPerPatient) {
      const rowData = uniqBy(filteredData.filter(d => d.patid === selectedPatid).map(d => {return {patid: d.patid, index: d.index, aeterm: d.aeterm}}), 'index')

      if(rowData.length > 0)
       names = <AdverseEventLabels data={rowData} xScale={xScale} yScale={yScale} xPos={xMin}/>
      }

      var events = null
      if(data.keyEvents !== undefined) {
        events = data.keyEvents.map((e,i) => {

          const event = <EventPolyline
            key={i}
            data={data}
            uniquePositions={uniquePositions}
            filteredData={filteredData}
            filter={filter}
            event={e}
            xScale={xScale}
            yScale={yScale}/>

          return <g key={i} id={e.column}>{event}</g>

        })
      }

      return [<div key='axis' align="right"><svg
      style={{verticalAlign: "bottom", marginRight: height < heightDiv ? "0px": "17px"}}
      ref={node => this.node = node}
      width={size.width}
      height="80px"
      onMouseOver={this.props.showKey}>
      <Axis
        side="top"
        lab="Time (days)"
        xScale={xScale}
        yPos={80}
      /></svg>
    </div>,
        <div
          key='graph'
          style={{height: `${heightDiv}px`, bottom: '0', right: '0',overflowY: 'auto', overflowX: 'hidden'}}
          align="right">
          <svg ref={node => this.node = node}
        width={size.width} height={height}>
            <AdverseEventRect
              filteredData={this.props.filteredData}
              xScale={xScale}
              yScale={yScale}
              colors={data.toxColors}/>
              {events}
              {names}
              <g id="background-rects">
                {backgroundRect}
              </g>
        </svg></div>]
   }
}

ToxPlot.defaultProps = {
  oneRowPerPatient: false
}

export default ToxPlot
