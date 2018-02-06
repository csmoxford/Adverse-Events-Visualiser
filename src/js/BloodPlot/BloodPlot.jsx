import React, {PureComponent } from 'react'
import { scaleLinear } from 'd3-scale'
import { min, max } from 'd3-array'

import CircleSet from '../utils/CircleSet'
import Axis from '../utils/Axis'


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


    var normRange
    if(measure.min !== undefined && measure.max !== undefined) {

      const minVar = measure.min > yScale.domain()[1] ? yScale.domain()[1] : Math.max(measure.min, yScale.domain()[0])
      const maxVar = measure.max < yScale.domain()[0] ? yScale.domain()[0] : Math.min(measure.max, yScale.domain()[1])

      normRange = <polyline
         points={`${xScale.range()[0]},${yScale(minVar)} ${xScale.range()[1]},${yScale(minVar)} ${xScale.range()[1]},${yScale(maxVar)} ${xScale.range()[0]},${yScale(maxVar)}`}
         fill="#00FF0040"
        />
    } else if(measure.max !== undefined) {

      const maxVar = measure.max < yScale.domain()[0] ? yScale.domain()[0] : Math.min(measure.max, yScale.domain()[1])

      normRange = <polyline
         points={`${xScale.range()[0]},${yScale.range()[0]} ${xScale.range()[1]},${yScale.range()[0]} ${xScale.range()[1]},${yScale(maxVar)} ${xScale.range()[0]},${yScale(maxVar)}`}
         fill="#00FF0040"
        />
    }



    return <svg ref={node => this.node = node}
      width={size.width} height={size.height}>
      {normRange}
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
