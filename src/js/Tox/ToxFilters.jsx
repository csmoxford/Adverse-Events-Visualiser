import React, { Component } from 'react'
import {uniq} from 'lodash'

import {Input, Select} from '../utils/Forms'


var $ = require('jquery')


const CausalitySelect = (props) => {

  const {label, column} = props

  return <Select id={column} label={label}>
    <option value={1}>All causality levels</option>
    <option value={2}>Unlikely related or higher</option>
    <option value={3}>Possibly related or higher</option>
    <option value={4}>Probability related or higher</option>
    <option value={5}>Definitely related or higher</option>
  </Select>
}



const GradeSelect = (props) => {

  return <Select id={props.id} label="Adverse Event Grade">
    <option value={1}>1-5</option>
    <option value={2}>2-5</option>
    <option value={3}>3-5</option>
    <option value={4}>4-5</option>
    <option value={5}>5</option>
  </Select>
}


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

    const causality = data.causality.map((c,i) => <CausalitySelect key={i} label={c.label} column={c.column}/>)

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
      }).map((t,i) => <option key={t}>{t}</option>)

      toxFilter = <Select key="Category" id="adverseEventCategory" label="Category" multiple>
        <option>All</option>
        {toxicityOptions}
      </Select>


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
      }).map((t,i) => <option key={t}>{t}</option>)

      toxFilter = <Select key="AE" id="adverseEventSelect" label="Adverse Event" multiple>
        <option>All</option>
        {toxicityOptions}
      </Select>

    } else if(this.state.toxFilterType === "4") {
      // to add keyAEgroups
      if(data.keyGroups !== undefined){

        const toxicityOptions = data.keyGroups.map((k,i) => <option key={i} value={k.column}>{k.label}</option>)
        toxFilter = <Select id="keyGroupSelect">
          {toxicityOptions}
        </Select>

      } else {
        toxFilter = null
      }
    }

    const times = data.keyDates.map((d,i) => <option key={i} value={d.column}>{d.label}</option>)

    return(
      <div id="toxicityFilter">
        <h4>Adverse Event Filter</h4>
        <Select id="adverseEventType" className="selectpicker" label="Filter by" onChange={this.updateFilterType.bind(this)}>
          <option value="1">None</option>
          <option value="2">Category</option>
          <option value="3">Adverse Event Name</option>
          {data.keyGroups !== undefined ? <option value="4">Key Groups</option> : null}
        </Select>
        {toxFilter}
        <GradeSelect id="adverseEventGrade"/>
        <Select id="adverseEventTimeFrom" label="Time period: From">
          {times}
        </Select>
        <Select id="adverseEventTimeTo" label="Time period: To" defaultValue={data.keyDates[data.keyDates.length-1].column}>
          {times}
        </Select>
        <Input id="presentCheck" label="Present at start" type="checkbox"/>
        <Input id="saeCheck" label="SAE" type="checkbox"/>
        {causality}
        <br/>
        <div className="filter-option">
          <button className="btn btn-primary btn-lg" id="changeFilter" onClick={() => updateFilterStateValues()}>
              Update
          </button>
        </div>
      </div>
    )
  }


}
export default ToxFilters
