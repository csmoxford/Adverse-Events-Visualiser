import React, { Component } from 'react'

import 'bootstrap-select'
import "bootstrap-select/dist/css/bootstrap-select.css"
import './ToxFilters.css'
import {uniq} from 'lodash'
var $ = require('jquery')

class ToxFilters extends Component {

  constructor(props){
     super(props)
     this.state = {
       toxFilterType: 1
     }
   }

  componentDidMount() {
    $('.selectpicker').selectpicker()
    $('#presentCheck').attr('checked','checked')
  }

  componentDidUpdate() {
    $('.selectpicker').selectpicker()
  }

  updateFilterType() {
    this.setState({
      toxFilterType: $('#adverseEventType').val()
    })
  }



  render() {

    const {data, updateFilterStateValues} = this.props
//&& $("#adverseEventGrade").val()  ``

    const causality = data.causality.map((c,i) => {
      return (<div key={i} className="filter-option">
      <label>{c.label}</label><br/>
        <select id={c.column} className="selectpicker">
          <option value={1}>All causality levels</option>
          <option value={2}>Unlikely related or higher</option>
          <option value={3}>Possibly related or higher</option>
          <option value={4}>Probability related or higher</option>
          <option value={5}>Definitely related or higher</option>
        </select>
      </div>
    )})

    var toxFilter;
    if(this.state.toxFilterType === "1") {
      toxFilter = null;
    } else if(this.state.toxFilterType === "2") {


      const toxicities = uniq(data.toxData.map((t) => t.aecategory))
      const toxicityOptions = toxicities.sort((a,b) => {
        let order = 0
        if(a > b)
          order = 1
        else if(a < b)
          order = -1
        return order
      }).map((t,i) => <option key={i}>{t}</option>)

      toxFilter = <div className="filter-option" key="category">
        <label htmlFor="adverseEventCategory">Category</label><br/>
        <select id="adverseEventCategory" multiple className="selectpicker">
          <option>All</option>
          {toxicityOptions}
        </select>
      </div>

      $('.selectpicker').selectpicker()
    } else if(this.state.toxFilterType === "3") {

      const toxicities = uniq(data.toxData.map((t) => t.aeterm))
      const toxicityOptions = toxicities.sort((a,b) => {
        let order = 0
        if(a > b)
          order = 1
        else if(a < b)
          order = -1
        return order
      }).map((t,i) => <option key={i}>{t}</option>)

      toxFilter = <div className="filter-option" key="ae">
        <label htmlFor="adverseEventSelect">Adverse Event</label><br/>
        <select id="adverseEventSelect" multiple className="selectpicker">
          <option>All</option>
          {toxicityOptions}
        </select>
      </div>
    } else if(this.state.toxFilterType === "4") {
      // to add keyAEgroups
      if(data.keyGroups !== undefined){

        const toxicityOptions = data.keyGroups.map((k,i) => <option key={i} value={k.column}>{k.label}</option>)
        toxFilter = <div className="filter-option">
          <label htmlFor="keyGroupSelect"></label><br/>
          <select id="keyGroupSelect" className="selectpicker">
            {toxicityOptions}
          </select>
        </div>
      } else {
        toxFilter = null
      }
    }

    const times = data.keyDates.map((d,i) => <option key={i} value={d.column}>{d.label}</option>)

    return(
      <div id="toxicityFilter">
        <h4>Adverse Event Filter</h4>
        <div className="filter-option">
          <label htmlFor="adverseEventType">Filter by</label><br/>
          <select id="adverseEventType" className="selectpicker" onChange={this.updateFilterType.bind(this)}>
            <option value="1">None</option>
            <option value="2">Category</option>
            <option value="3">Adverse Event Name</option>
            {data.keyGroups !== undefined ? <option value="4">Key Groups</option> : null}
          </select>
        </div>
        {toxFilter}
        <div className="filter-option">
          <label>Adverse Event Grade</label><br/>
          <select id="adverseEventGrade" className="selectpicker">
            <option value={1}>1-5</option>
            <option value={2}>2-5</option>
            <option value={3}>3-5</option>
            <option value={4}>4-5</option>
            <option value={5}>5</option>
          </select>
        </div>

        <div className="filter-option">
          <label>Time period: From</label><br/>
          <select id="adverseEventTimeFrom" className="selectpicker">
            {times}
          </select>
        </div>
        <div className="filter-option">
          <label>Time period: To</label><br/>
          <select id="adverseEventTimeTo" className="selectpicker" defaultValue={data.keyDates[data.keyDates.length-1].column}>
            {times}
          </select>
        </div>

        <div className="form-check filter-option">
          <input id="presentCheck" type="checkbox" className="form-check-input"/>
          <label  htmlFor="presentCheck" className="form-check-label checkBox">Present at start</label>
        </div>

        <div className="form-check filter-option">
          <input id="saeCheck" type="checkbox" className="form-check-input"/>
          <label  htmlFor="saeCheck" className="form-check-label checkBox">SAE</label>
        </div>
        {causality}
        <br/>
        <div className="filter-option">
          <button className="btn btn-primary btn-lg" id="changeFilter"
            onClick={() => updateFilterStateValues()}>
              Update
          </button>
        </div>
      </div>
    )
  }


}
export default ToxFilters
