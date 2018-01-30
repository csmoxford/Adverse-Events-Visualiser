import React, {PureComponent } from 'react'
import { scaleLinear } from 'd3-scale'
import { min, max } from 'd3-array'
import Axis from './utils/Axis'
import {uniq, uniqBy} from 'lodash'

import CircleSet from './utils/CircleSet'


class BloodPlot extends PureComponent {


  render() {

    const {size, data, xScale, measure} = this.props
    const offset={top: 10, bottom: 50}

    console.log(data);

    const yMin = min(data.map((d) => d.y)) / 1.02
    const yMax = max(data.map((d) => d.y)) * 1.02
    const yScale = scaleLinear()
       .domain([yMin, yMax])
       .range([size.height-offset.bottom, offset.top])


    const minLine = measure.min == undefined? null: <polyline
       points={`${xScale.range()[0]},${yScale(measure.min)} ${xScale.range()[1]},${yScale(measure.min)}`}
       stroke={'#FF0000'}
       strokeWidth={2}
       />

     const maxLine = measure.max == undefined? null: <polyline
        points={`${xScale.range()[0]},${yScale(measure.max)} ${xScale.range()[1]},${yScale(measure.max)}`}
        stroke={'#FF0000'}
        strokeWidth={2}
        />


    return <svg ref={node => this.node = node}
      width={size.width} height={size.height}>
      {minLine}
      {maxLine}
      <CircleSet
        data={data}
        xScale={xScale}
        yScale={yScale}
        />
      <Axis
        side="bottom"
        lab="Time (days)"
        xScale={xScale}
        yScale={yScale}
        yPos={yScale.range()[0]}
      />
      <Axis
        side="left"
        lab=""
        xScale={xScale}
        yScale={yScale}
      />
    </svg>
  }
}


BloodPlot.defaultProps = {
  size: {width: 500, height: 400}
}

export default BloodPlot
