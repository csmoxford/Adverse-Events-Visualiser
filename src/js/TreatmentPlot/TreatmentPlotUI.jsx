import React, { PureComponent } from 'react'
import TreatmentPlot from './TreatmentPlot'
import {max } from 'd3-array'
import {uniqBy} from 'lodash'
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
/*
  componentDidUpdate() {
    $('.selectpicker').selectpicker()
  }
*/
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
    const {data} = this.props


    const specification = this.state.treatmentSpecification !== undefined ? this.state.treatmentSpecification : data.treatmentSpecification



    const treatmentSpecs = uniqBy(data.treatmentSpecification, d => d.index)

    var treatmentSelect
    if(treatmentSpecs.length >= 2) {
      const options = treatmentSpecs.map((t,i) => <option key={i} value={t.index}>{t.label}</option>)

      treatmentSelect = <div className="filter-option">
        <label>Treatments</label><br/>
        <select id="treatments" multiple className="selectpicker" onChange={this.onTreatmentSelect}>
          <option value="all">All</option>
          {options}
        </select>
      </div>
    }

    return <div>
      <div className="row">
        <div style={{height: "20px"}}>
        </div>
        <div className="col-xs-12">
          {treatmentSelect}
        </div>
        <div className="col-xs-12">
          <TreatmentPlot
            data={data}
            treatmentSpecification={specification}
            selectedPatient={this.props.selectedPatient}
            showDetails={this.props.showDetails}/>
        </div>
      </div>
    </div>
  }

}

export default TreatmentPlotUI
