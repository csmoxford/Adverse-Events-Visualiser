import React, {Component} from 'react'
import {DayDifference} from '../formatDate'

// prevent update caused by xScale and mouseover event
class EventPolyline extends Component {

  render() {
    const {data, event, uniquePositions, filter, xScale, yScale, offset} = this.props
    const eventPolyline = uniquePositions.map((d,j) => {
      const patient = data.patientData.find(p => p.patid === d.patid)
      const x = offset + DayDifference(patient[filter.from], patient[event.column])

      if(!isNaN(x)){
        return <polyline
          key={j}
          points={`${xScale(x)},${yScale(d.min-0.5)} ${xScale(x)},${yScale(d.max+0.5)}`}
          stroke={event.color}
          strokeWidth={3}
          strokeDasharray={event.dash ? "5,5" : ""}
          />
      } else {
        return null
      }
    })

    return <g id={event.column}>{eventPolyline}</g>
  }
}


EventPolyline.defaultProps = {
  offset: 1
}

export default EventPolyline
