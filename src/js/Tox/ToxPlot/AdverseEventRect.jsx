import React, {Component } from 'react'
import {defaultToxColors} from '../../utils/Constants'

// prevent update caused by xScale and mouseover event
class AdverseEventRect extends Component {

  shouldComponentUpdate(prevProps) {
    return prevProps.filteredData != this.props.filteredData
  }

  render() {
    const { filteredData, colors, xScale, yScale} = this.props

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
       fill={colors[d.aegrade]}
       />
     })

    return <g id="adverseEventRects">{rects}</g>
  }
}

AdverseEventRect.defaultProps = {
  colors: defaultToxColors
}

export default AdverseEventRect
