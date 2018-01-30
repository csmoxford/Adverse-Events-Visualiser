import React, {PureComponent} from 'React'

var $ = require('jquery')

class PatientSelect extends PureComponent {


  constructor(props) {
    super(props)
    this.OnSelectUpdate = this.OnSelectUpdate.bind(this)
  }

  componentDidMount() {
    $('#patidSelect button').css('background', this.props.treatment.find(t => t.value == this.props.patients[0].treatment).color + "40")
  }

  OnSelectUpdate() {

    const patient = this.props.patients.find(p => p.patid ==$('#patid').val())
console.log(patient);
    $('#patidSelect button').css('background', this.props.treatment.find(t => t.value == patient.treatment).color + "40")

    this.props.didChange()
  }

  render() {

    const {patients, treatment} = this.props

    var patientOptions
    if(treatment != undefined) {
      patientOptions = patients.map((d,i) => <option key={i} style={{backgroundColor: treatment.find(t => t.value == d.treatment).color + "40"}}>{d.patid}</option>)
    } else {
      patientOptions = patients.map((d,i) => <option key={i}>{d.patid}</option>)
    }

    return <div id="patidSelect" className="add-patient">
      <label htmlFor="patid">Patient Trial Number</label><br/>
      <select id="patid" className="selectpicker" onChange={this.OnSelectUpdate} style={{background: '#BBBBFF'}}>
        {patientOptions}
      </select>
    </div>
  }
}


export default PatientSelect
