import React, {PureComponent} from 'react'
import {scaleLinear} from 'd3-scale'
import {max} from 'd3-array'





class TreatmentKeySingle extends PureComponent {


  render() {

    const {treatment, height, position} =  this.props

    const key = treatment.doseColors.map((c,i) => {

      return <g key={i}>
        <polyline
          points={`${20},${(i+0.6)*height} ${20},${(i+1.4)*height}`}
          stroke={c.color}
          strokeWidth={4}
          strokeLinecap="round"/>
        <text
          x={60}
          y={(i+1)*height}
          dominantBaseline="middle">{c.label != undefined? c.label: c.value}</text>
      </g>
    })

  return <g className="treatmentkey" transform={`translate(${position.left}, ${position.top})`}>
      <text
        x={60}
        y={0}
        dominantBaseline="middle">{treatment.label}</text>
      {key}
    </g>

  }
}


TreatmentKeySingle.defaultProps = {
  height: 30,
  position: {top:50, left: 50}
}




class TreatmentKeyDouble extends PureComponent {




  render() {


      const {treatment, height, position} =  this.props

      const key = treatment.doseColors.map((c,i) => {

        return <g key={i}>
          <polyline
            points={`${0},${(i+0.6)*height} ${40},${(i+0.6)*height} ${40},${(i+1.4)*height} ${0},${(i+1.4)*height}`}
            fill={c.color}/>
          <text
            x={60}
            y={(i+1)*height}
            dominantBaseline="middle">{c.label != undefined? c.label: c.value}</text>
        </g>
      })

    return <g className="treatmentkey" transform={`translate(${position.left}, ${position.top})`}>
        <text
          x={60}
          y={0}
          dominantBaseline="middle">{treatment.label}</text>
        {key}
      </g>

  }
}

TreatmentKeyDouble.defaultProps = {
  height: 30,
  position: {top:50, left: 50}
}

export {TreatmentKeySingle, TreatmentKeyDouble}
