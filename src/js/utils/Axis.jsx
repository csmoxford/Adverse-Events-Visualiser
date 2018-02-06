import React, { PureComponent } from 'react'
import getTicksNumeric from './getTicks'

import './Axis.css'

class Axis extends PureComponent {


  render() {

    const {side, width, yScale, xScale, lab} = this.props

    var mergedTicks
    /*********************************************************************/
    if(side === "top" || side === 'bottom') {
      const yPos = this.props.yPos === null ? (side === "top" ? yScale.range()[0] : yScale.range()[1]) : this.props.yPos
      const ticks = this.props.ticks === null ? getTicksNumeric(xScale) : this.props.ticks
      const label = this.props.label === null ? ticks: this.props.label
      const xRange = xScale.domain()
      const xMin = this.props.xMin === null? xScale(xScale.domain()[0]) : this.props.xMin
      const xMax = this.props.xMax === null? xScale(xScale.domain()[1]) : this.props.xMax
      const sign = side === 'top' ? -1: 1
      const labOffset = this.props.labOffset === null?  40: this.props.labOffset

      mergedTicks = ticks.map((d,i) => {return {tick: d, label: label[i]}})
      mergedTicks.filter((thing, index, self) =>
        index === self.findIndex((t) => (
          t.tick === thing.tick && t.label === thing.label
        ))
      )

      const axis = mergedTicks.filter((t) => t.tick >= xRange[0] && t.tick <= xRange[1])
        .map((t,i) => <g
            key={i}
            className="tick"
            opacity="1"
            transform={"translate(" + xScale(t.tick) + "," + yPos + ")"}>
            <line stroke="#000" y2={sign*10}></line>
            <text fill="#000"
              y={sign * 20}
              dominantBaseline="central"
              textAnchor="middle">{t.label}</text>
          </g>
        )

      return <g id={side + "-axis"}>
        <polyline
          stroke="#000"
          strokeWidth={width}
          points={(xMin-width/2) + "," + yPos + " " + xMax + "," + yPos}
          />
        {axis}
        <text className="axisLabel"
          x={(xMin + xMax)/2}
          y={yPos + sign*labOffset}
          textAnchor="middle"
          alignmentBaseline="central">{lab}</text>
      </g>
      /*********************************************************************/
  } else {
    const xPos = this.props.xPos === null ? (side === 'left' ? xScale.range()[0] : xScale.range()[1]) : this.props.xPos
    const ticks = this.props.ticks === null ? getTicksNumeric(yScale) : this.props.ticks
    const label = this.props.label === null ? ticks : this.props.label
    const yDomain = yScale.domain()
    const yMin = this.props.yMin === null ? yScale(yDomain[0]): this.props.yMin
    const yMax = this.props.yMax === null ? yScale(yDomain[1]): this.props.yMax
    const sign = side === 'left' ? -1 : 1
    const labOffset = this.props.labOffset === null?  30: this.props.labOffset
    // console.log(yMin + "," + yMax);
    mergedTicks = ticks.map((d,i) => {return {tick: d, label: label[i]}})
    mergedTicks.filter((thing, index, self) =>
      index === self.findIndex((t) => (
        t.tick === thing.tick && t.label === thing.label
      ))
    )

    const axis = mergedTicks.filter((t) => t.tick >= yDomain[0] && t.tick <= yDomain[1])
      .map((t,i) => <g
          key={i}
          className="tick"
          opacity="1"
          transform={`translate(${xPos},${yScale(t.tick)})`}>
          <line stroke="#000"
            x2={sign*10}/>
          <text fill="#000"
            x={sign*15}
            textAnchor={sign === 1 ? "start" : "end"}
            dominantBaseline="middle"
            >{t.label}</text>
        </g>
      )

    return <g id={side + "-axis"}>
        <polyline
          stroke="#000"
          strokeWidth={width}
          points={xPos + "," + (yMin-width/2) + " " + xPos + "," + yMax}
          />
        {axis}
        <text
          className="axisLabel"
          transform="rotate(270)"
          x={-(yMin + yMax)/2}
          y={xPos + sign*labOffset /* rotate 270 so multiply (x,y) by matrix [[0 1][-1 0]] */}
          textAnchor="middle"
          alignmentBaseline="ideographic">{lab}</text>
    </g>
  }
  }

}

Axis.defaultProps = {
  side: "x",
  xLab: "",
  ticks: null,
  label: null,
  xMin: null,
  xMax: null,
  yMin: null,
  yMax: null,
  xPos: null,
  yPos: null,
  width: 4,
  y: 0,
  labOffset: null
}

export default Axis
