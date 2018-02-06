import React, {PureComponent} from 'react'
import {uniqBy} from 'lodash'






class TreatmentTable extends PureComponent {




  render() {


    const {data} = this.props

    const treatmentSpecs = uniqBy(data.treatmentSpecification, t => t.index)

    const treatmentUI = data.treatment.map((t,i) => <th key={i} style={{backgroundColor: t.color + '40', paddingLeft: 5, paddingRight: 5}}>{t.label}</th>)

    const rows = treatmentSpecs.map((t,i) => {
      const doseColors = t.doseColors.sort((a,b) => {
        var val = 0
        if(a.value < b.value) {
          val = 1
        } else if(a.value > b.value) {
          val = -1
        }
        return val
      })
      const values = data[t.datasetName].map(p => {
        return {
        treatment: p.treatment,
        value: doseColors.find(dc =>  p[t.column] >= dc.value).value
      }})

      return t.doseColors.map((d,j) => {
        const treatmentTD = data.treatment.map((t,k) => <td key={k} style={{backgroundColor: t.color + '40'}}>{values.filter(v => v.value == d.value && v.treatment == t.value).length}</td>)

        return <tr key={`${i},${j}`}>
        {j == 0 ? <td rowSpan={t.doseColors.length}>{t.label}</td>: null}
        <td>{d.label == undefined ? d.value: d.label}</td>
        {treatmentTD}
      </tr>})
    })



    return <table className="center">
      <tbody>
        <tr>
          <th colSpan={2}></th>
          {treatmentUI}
        </tr>
        {rows}
      </tbody>
    </table>
  }


}

export default TreatmentTable
