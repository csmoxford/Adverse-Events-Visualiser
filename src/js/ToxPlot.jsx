import React, {Component, PureComponent } from 'react'
import { scaleLinear } from 'd3-scale'
import { min, max } from 'd3-array'
import Axis from './utils/Axis.jsx'
import {uniq, uniqBy} from 'lodash'
import {getToxicityColor} from './utils/getColors'
import {DayDifference} from './utils/formatDate'



class AdverseEventRect extends Component {


  shouldComponentUpdate(prevProps) {
    return prevProps.filteredData !== this.props.filteredData
  }

  render() {

    const {filteredData, xScale, yScale} = this.props

    function GradeSort(a,b) {
      let val = 0
      if(a.aegrade > b.aegrade)
        val = 1
      else if(a.aegrade < b.aegrade)
        val = -1
      return val
    }

    const rects = filteredData.filter(d => !isNaN(d.toxStart) && !isNaN(d.aegrade)).sort(GradeSort)
       .map((d,i) => {
        return <rect
         key={'rect' + i}
         x={xScale(d.toxStart < 0 ? 0: d.toxStart)}
         y={yScale(d.index - 0.5)}
         height={yScale(d.index + 0.5) - yScale(d.index - 0.5)}
         width={xScale(d.toxEnd) - xScale(d.toxStart < 0 ? 0: d.toxStart) > 0 ? xScale(d.toxEnd) - xScale(d.toxStart < 0 ? 0: d.toxStart) : 1}
         fill={getToxicityColor(d.aegrade)}
         />
       })

       return <g id="adverseEventRects">{rects}</g>
  }
}

class ToxPlot extends PureComponent {

/*
   constructor(props){
      super(props)
   }
*/

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
    const {size, data, totalHeight, selectedPatient, offset, filter, oneRowPerPatient} = this.props
    var filteredData = this.props.filteredData

    if(filteredData.length === 0) {
      return <div><br/>No data was sent. Graph could not be plotted.</div>
    }

    this.getIndex(filteredData, oneRowPerPatient)

    const xMin = 0
    const xMax = max(filteredData.map((d) => d.toxEnd)) + 1
    const yMin = min(filteredData.map((d) => d.index)) - 0.5
    const yMax = max(filteredData.map((d) => d.index)) + 0.5

    const height = 30 * (max(filteredData.map(d => d.index))+1)

    const column = "nelfdate"

    const heightDiv = totalHeight - 80

    const yScale = scaleLinear()
       .domain([yMin, yMax])
       .range([0, height])
    const xScale = scaleLinear()
      .domain([xMin, xMax])
      .range([offset.left, size.width - offset.right])


      const indexes = filteredData.filter(d => d.patid == selectedPatient).map(d => d.index)

      const uniquePatid = uniq(filteredData.map(d => d.patid))
      const uniquePositions = uniquePatid.map((d) => {
        const vals = filteredData.filter(dx => dx.patid === d).map(dx => dx.index)
        const mn = min(vals)
        const mx = max(vals)
        return {patid: d, treatment: filteredData.find(dx => dx.patid == d).treatment, min: mn, max: mx, mid: (mn+mx)/2}
      })


      const backgroundRect = uniquePositions
         .map((d,i) => {
         return <g key={d.patid}><rect
           x={xScale(xMin)+1}
           y={yScale(d.min - 0.5)}
           height={yScale(d.max + 0.5) - yScale(d.min - 0.5)}
           width={xScale(xMax)-xScale(xMin)}
           fill={d.patid == selectedPatient ? "#000": data.treatment.find(t => t.value === d.treatment).color}
           fillOpacity={d.patid == selectedPatient ? 0.2:0.1}
           stroke={data.treatment.find(t => t.value === d.treatment).color}
           strokeOpacity={0.2}
           onMouseOver={(e) => this.props.showDetails(filteredData.filter(dta => dta.patid === d.patid),e)}
         />
       {names}
       </g>
     })

     var names = null

     if(!oneRowPerPatient) {
      const rowData = uniqBy(filteredData.filter(d => d.patid == selectedPatient).map(d => {return {patid: d.patid, index: d.index, aeterm: d.aeterm}}), 'index')

      if(rowData.length > 0)
       names = <g id="names">{rowData.map((d,i) => {
           return <text
             key={i}
             x={xScale(xMin)+5}
             y={yScale(d.index)}
             dominantBaseline="middle"
             >{d.aeterm}</text>})}</g>
      }



      var events = null
      if(data.keyEvents !== undefined) {
        events = data.keyEvents.map((e,i) => {

          const event = uniquePositions.map((d,j) => {
            const patient = data.patientData.find(p => p.patid == d.patid)
            const x = DayDifference(patient[filter.from], patient[e.column])
            return <polyline
              key={j}
              points={`${xScale(x)},${yScale(d.min-0.5)} ${xScale(x)},${yScale(d.max+0.5)}`}
              stroke={e.color}
              strokeWidth={3}
              />
          })

          return <g key={i} id={e.column}>{event}</g>

        })
      }


      return [<div  style={{height: '30px'}}></div>,
      <div align="right"><svg
      style={{verticalAlign: "bottom", marginRight: height < heightDiv ? "0px": "17px"}}
      ref={node => this.node = node}
      width={size.width} height="50px">
      <Axis
        side="top"
        lab="Time (days)"
        xScale={xScale}
        yPos={50}
      /></svg>
    </div>,
        <div
          style={{height: `${heightDiv}px`, bottom: '0', right: '0',overflowY: 'auto', overflowX: 'hidden'}}
          align="right">
          <svg ref={node => this.node = node}
        width={size.width} height={height}>
        <AdverseEventRect
          filteredData={this.props.filteredData}
          xScale={xScale}
          yScale={yScale}/>
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
