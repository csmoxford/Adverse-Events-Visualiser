import React, {Component} from 'react'


class CircleSet extends Component {

  shouldComponentUpdate(prevProps) {
    return this.props.data != prevProps.data
  }

  render() {

    const {data, xScale, yScale, color, radius} = this.props
console.log(data);
    const circles = data.map((d,i) => <circle
      key={i}
      cx={xScale(d.x)}
      cy={yScale(d.y)}
      r={radius}
      fill={color}
    />)

    return <g id='#circleSet'>{circles}</g>

  }
}

CircleSet.defaultProps = {
  color: '#000',
  radius: '5px'

}

export default CircleSet
