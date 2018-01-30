import React, {PureComponent} from 'react'
import {scaleLinear} from 'd3-scale'
import {max} from 'd3-array'
import {uniqBy} from 'lodash'
import {TreatmentKeySingle, TreatmentKeyDouble} from './TreatmentKey'

class TreatmentPlotKey extends PureComponent {


  render() {

    const {data} = this.props

    const uniqueSpec = uniqBy(data.treatmentSpecification, d => d.index)


    var currentPos = 50
    const height = 30
    const keys = uniqueSpec.map((d,i) => {

      const takeupHeight = (d.doseColors.length + 1.5) * height
      const pos = currentPos
      currentPos += takeupHeight

      if(d.type == "Single") {
        return <TreatmentKeySingle key={i} treatment={d} height={height} position={{left: 50, top: pos}}/>
      } else if(d.type == "Double") {
        return <TreatmentKeyDouble key={i} treatment={d} height={height} position={{left: 50, top: pos}}/>
      }

    })

    return <svg width={250} height={currentPos}>
      {keys}
    </svg>

  }
}


export default TreatmentPlotKey
