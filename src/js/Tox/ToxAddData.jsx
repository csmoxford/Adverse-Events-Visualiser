import React, { Component } from 'react'
import 'bootstrap-select'
import "bootstrap-select/dist/css/bootstrap-select.css"
import './ToxFilters.css'
import './ToxAddData.css'
import {DayDifference} from '../utils/formatDate'

import PatientSelect from '../utils/PatientSelect'
var $ = require('jquery')



class ToxAddData extends Component {

  constructor(props){
     super(props)
     this.submitEvent = this.submitEvent.bind(this)
     this.state = {
       message: ""
     }
  }

  componentDidMount() {
    $('.matched').matchHeight();
  }

  submitEvent() {

    const {data, filterValues} = this.props

    var row = {}

    row.patid = $('#patid').val()

    row.aeterm = $('#aeterm').val()
    row.aecategory = $('#aecategory').val()
    /************************************************************/
    // validations
    if(row.aestopdate < row.aestartdate) {
      this.setState({message: "Data not added: End date mut be after start date"})
      return
    }

    if(row.aeterm === "") {
      this.setState({message: "Data not added: Adverse Event cannot be missing"})
      return
    }
    /************************************************************/

    const patient = data.patientData.find(d => d.patid === row.patid)
    Object.assign(row, patient)

    row.aestartdate = new Date($('#aestartdate').val())
    row.aestopdate = new Date($('#aestopdate').val())



    row.toxStart = DayDifference(patient[filterValues.from], row.aestartdate) // miliseconds in a day
    row.toxEnd = 1+DayDifference(patient[filterValues.from], row.aestopdate) // miliseconds in a day

    row.aegrade = $('#aegrade').val()
    row.sae = $('#sae').is(':checked')

    var i
    // causality
    if(data.causality !== undefined) {
      for (i = 0; i < data.causality.length; i++) {
        const c = data.causality[i]
        row[c.column] = $("#c_" + c.column).val()
      }
    }

    // key groups
    if(data.keyGroups !== undefined) {
      for (i = 0; i < data.keyGroups.length; i++) {
        const c = data.keyGroups[i]
        row[c.column] = $("#kg_" + c.column).is(':checked')
      }
    }

    this.setState({message: "Data added."})
    this.props.addAdverseEvent(row)

  }

  render() {

    const {data} = this.props

    var causality
    if(data.causality !== undefined) {
    causality = data.causality.map((c,i) => {
          return (<div key={i} className="filter-option">
            <label>{c.label}</label><br/>
            <select id={"c_" + c.column} className="selectpicker" defaultValue={5}>
              <option value={1}>Not related</option>
              <option value={2}>Unlikely related</option>
              <option value={3}>Possibly related</option>
              <option value={4}>Probability related</option>
              <option value={5}>Definitely related</option>
            </select>
          </div>
        )})
      }
    var keyGroups
    if(data.keyGroups !== undefined) {
      keyGroups = data.keyGroups.map((c,i) => {
            return (<div key={i} className="filter-option">
              <input id={"kg_" + c.column} type="checkbox" className="form-check-input"/>
              <label  htmlFor="sae" className="form-check-label checkBox">{c.label}</label>
            </div>
          )})
    }

    return <div className="item-main" style={{paddingTop: '30px', margin: '0px auto'}}>
      <div className="row">
        <div className="col-xs-12">
          <h4>Add event data</h4>
          <p>This form allows you to temporarily add additional events to the dataset.</p>
        </div>
        <div className="col-xs-6 matched">
          <div className="redbox">
            <h4><b>Required information</b></h4>
            <PatientSelect className="add-patient"
              patients={data.patientData}
              treatment={data.treatment}/>
            <div className="add-patient">
              <label htmlFor="aecategory">Category</label><br/>
              <input id="aecategory" className="form-control"/>
            </div>
            <div className="add-patient">
              <label htmlFor="aeterm">Adverse Event</label><br/>
              <input id="aeterm" className="form-control"/>
            </div>
            <div className="add-patient">
              <label htmlFor="aegrade">Grade</label><br/>
              <select id="aegrade" className="selectpicker">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </div>
            <div className="form-check filter-option">
              <input id="sae" type="checkbox" className="form-check-input"/>
              <label  htmlFor="sae" className="form-check-label checkBox">SAE</label>
            </div>
            <div className="add-patient">
              <label htmlFor="aestartdate">Start Date</label><br/>
              <input id="aestartdate" type="date" className="form-control"/>
            </div>
            <div className="add-patient">
              <label htmlFor="aestopdate">End Date</label><br/>
              <input id="aestopdate" type="date" className="form-control"/>
            </div>
          </div>
          </div>
          <div className="col-xs-6 matched">
            <div className="greenbox">
              <h4>Additional information</h4>
              {causality !== undefined? <h4>Causality</h4>: null}
              {causality}
              {keyGroups !== undefined? <h4>Is a member of key group?</h4>: null}
              {keyGroups}
            </div>
          </div>

          <div className="col-xs-12" style={{paddingTop: '30px'}}>
            <button className="btn btn-primary btn-lg" id="changeFilter"
              onClick={this.submitEvent}>
                Update
            </button>
            <br/>
            <p>{this.state.message}</p>
          </div>
        </div>
    </div>

  }

}

export default ToxAddData
