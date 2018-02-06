import React, {Component } from 'react'



const AdverseEventLabels = (props) => {

  const {data, xScale, yScale, xPos} = props

 return <g id="names">{data.map((d,i) => {
     return <text
       key={i}
       x={xScale(xPos)+5}
       y={yScale(d.index)}
       dominantBaseline="middle"
       >{d.aeterm}</text>})}</g>


}

AdverseEventLabels.defaultProps = {
  xPos: 0
}

export default AdverseEventLabels
