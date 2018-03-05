import React, {PureComponent} from 'react'
import {Select} from './Forms'
import getTreatment from './getTreatment'

var $ = require('jquery')

class PatientSelect extends PureComponent {

  constructor(props) {
    super(props)
    this.OnSelectUpdate = this.OnSelectUpdate.bind(this)
  }

  componentDidMount() {
    console.log(this.props.patients[0]);
    $('#patidSelect button').css('background', getTreatment(this.props.treatment,this.props.patients[0]).color + "40")
  }

  OnSelectUpdate() {
    const patient = this.props.patients.find(p => p.patid === $('#patid').val())
    $('#patidSelect button').css('background', getTreatment(this.props.treatment,patient.treatment).color + "40")
    if(this.props.didChange !== undefined) {
      this.props.didChange()
    }
  }

  render() {

    const {patients, treatment} = this.props
    var patientOptions
    if(treatment !== undefined) {
      patientOptions = patients.map((d,i) => <option key={i} style={{backgroundColor: getTreatment(treatment,d).color + "40"}}>{d.patid}</option>)
    } else {
      patientOptions = patients.map((d,i) => <option key={i}>{d.patid}</option>)
    }

    return <div id="patidSelect">
      <Select id="patid" label="Patient Trial Number" onChange={this.OnSelectUpdate}>
        {patientOptions}
      </Select>
    </div>
  }
}


export default PatientSelect
