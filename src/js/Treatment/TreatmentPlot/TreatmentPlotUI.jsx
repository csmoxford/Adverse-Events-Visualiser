import React, { PureComponent } from 'react'
import TreatmentPlot from './TreatmentPlot'
import {uniqBy} from 'lodash'
import {Select} from '../../utils/Forms'
var $ = require('jquery')

class TreatmentPlotUI extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      treatmentSpectification: undefined
    }
    this.onTreatmentSelect = this.onTreatmentSelect.bind(this)
  }

  componentDidMount() {
    $('.selectpicker').selectpicker()
  }

  componentDidMount() {
    console.log("TreatmentPlotUI is mounting");
  }

  onTreatmentSelect() {
    const selected = $("#treatments").val()
    if(selected.includes("all")) {
      this.setState({treatmentSpecification: undefined})
    } else {
      const treatmentSpecification = this.props.data.treatmentSpecification
      this.setState({treatmentSpecification: treatmentSpecification.filter(t => selected.includes(String(t.index)))})
    }
  }

  render() {
    const {data, size, filter} = this.props

    const specification = this.state.treatmentSpecification !== undefined ? this.state.treatmentSpecification : data.treatmentSpecification
    const treatmentSpecs = uniqBy(data.treatmentSpecification, d => d.index)

    // only include a select if there is more than 1 treatment indexed
    var treatmentSelect
    if(treatmentSpecs.length >= 2) {
      const options = treatmentSpecs.map((t,i) => <option key={i} value={t.index}>{t.label}</option>)

      treatmentSelect = <Select id="treatments" label="Treatments" multiple onChange={this.onTreatmentSelect}>
        <option value="all">All</option>
        {options}
      </Select>
    }

    return <div>
        {treatmentSelect}
        <TreatmentPlot
          data={data}
          size={size}
          filter={filter}
          totalHeight={this.props.totalHeight}
          treatmentSpecification={specification}
          selectedPatient={this.props.selectedPatient}
          showDetails={this.props.showDetails}/>
    </div>
  }

}

export default TreatmentPlotUI
