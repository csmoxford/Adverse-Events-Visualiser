import React from 'React'


const PatientSelect = (props) => {

  const patientOptions = props.data.map((d,i) => <option key={i}>{d.patid}</option>)

  return <div className="add-patient">
    <label htmlFor="patid">Patient Trial Number</label><br/>
    <select id="patid" className="selectpicker" onChange={props.didChange}>
      {patientOptions}
    </select>
  </div>
}


export default PatientSelect
