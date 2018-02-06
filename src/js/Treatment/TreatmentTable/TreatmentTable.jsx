import React, {PureComponent } from 'react'







class TreatmentTable extends PureComponent {

  const {data} = this.props


  render() {

    const treatment = data.treatment.find(t => selectedPatient.treatment === t.value)

    const treatmentSpecs = uniqBy(data.treatmentSpecification, t => t.index)


    const treatmentUI = data.treatment.map((t,i) => <th key={i} style={{backgroundColor: t.color + '40'}}>{t.label} (n={numberOfPatients[i]})</th>)

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

      const values = data[t.datasetName].filter(p => p.patid == selectedPatient.patid).map(p => doseColors.find(dc =>  p[t.column] >= dc.value).value)

      return t.doseColors.map((d,j) => <tr key={`${i},${j}`}>
        {j == 0 ? <td rowSpan={t.doseColors.length}>{t.label}</td>: null}
        <td>{d.label == undefined ? d.value: d.label}</td>
        <td>{values.filter(v => v == d.value).length}</td>
      </tr>)
    })



    return <table className="center">
      <tbody>
        <tr>
          <th></th>
          {treatmentUI}
        </tr>
        <tr>
          <th>Test</th>
        </tr>
        {rows}
      </tbody>
    </table>
  }


}
