import React from 'React'


const PatientSelect = (props) => {

  var patientOptions
  if(props.treatment != undefined) {
    patientOptions = props.data.map((d,i) => <option key={i} style={{backgroundColor: props.treatment.find(t => t.value == d.treatment).color + "40"}}>{d.patid}</option>)
  } else {
    patientOptions = props.data.map((d,i) => <option key={i}>{d.patid}</option>)
  }

  return <div className="add-patient">
    <label htmlFor="patid">Patient Trial Number</label><br/>
    <select id="patid" className="selectpicker" onChange={props.didChange}>
      {patientOptions}
    </select>
  </div>
}


export default PatientSelect
