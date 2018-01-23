import React, {Component } from 'react'
import {DayDifference} from './formatDate'

// prevent update caused by xScale and mouseover event
class EventPolyline extends Component {

  shouldComponentUpdate(prevProps) {
    return prevProps.filteredData != this.props.filteredData
  }

  render() {
    const {data, filteredData, event, uniquePositions, filter, xScale, yScale} = this.props

    const eventPolyline = uniquePositions.map((d,j) => {
      const patient = data.patientData.find(p => p.patid == d.patid)
      const x = DayDifference(patient[filter.from], patient[event.column])
      if(!isNaN(x)){
        return <polyline
          key={j}
          points={`${xScale(x)},${yScale(d.min-0.5)} ${xScale(x)},${yScale(d.max+0.5)}`}
          stroke={event.color}
          strokeWidth={3}
          />
      } else {
        return null
      }
    })

    return <g id={event.column}>{eventPolyline}</g>
  }
}


export default EventPolyline
