import React, {PureComponent } from 'react'
import { scaleLinear } from 'd3-scale'
import { min, max } from 'd3-array'
import Axis from './utils/Axis'
import {uniq, uniqBy} from 'lodash'

import CircleSet from './utils/CircleSet'


class BloodPlot extends PureComponent {


  render() {

    const {size, data, xScale} = this.props
    const offset={top: 30, bottom: 50}

    console.log(data);

    const yMin = min(data.map((d) => d.y)) / 1.02
    const yMax = max(data.map((d) => d.y)) * 1.02
    const yScale = scaleLinear()
       .domain([yMin, yMax])
       .range([size.height-offset.bottom, offset.top])


    return <svg ref={node => this.node = node}
  width={size.width} height={size.height}>
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
  size: {width: 500, height: 500}
}

export default BloodPlot
