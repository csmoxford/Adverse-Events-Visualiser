import React, {Component } from 'react'
import { scaleLinear } from 'd3-scale'
import { min, max } from 'd3-array'
import Axis from './utils/Plot/Axis'
import {uniqBy} from 'lodash'

import {Select} from './utils/Forms'

import BloodPlot from './BloodPlot/BloodPlot'

import PatientSelect from './utils/PatientSelect'

import AdverseEventRect from './Tox/ToxPlot/AdverseEventRect'
import AdverseEventLabels from './Tox/ToxPlot/AdverseEventLabels'

import ShowToxicityRecord from './Tox/ShowPatient/ShowToxicityRecord'
import ShowTreatmentSummary from './Treatment/ShowPatient/ShowTreatmentSummary'

import TreatmentPlotOnePatient from './Treatment/TreatmentPlot/TreatmentPlotOnePatient'

import ToxPlotKey from './Tox/ToxPlot/ToxPlotKey'
import TreatmentPlotKey from './Treatment/TreatmentPlot/TreatmentPlotKey'

var $ = require('jquery')


function getIndex(data, oneRowPerPatient = false) {
  var numberUnique = -1
  for (var i = 0; i < data.length; i++) {
    var isNew = true
    var j = 0
    while(isNew && j<i) {
      if(data[i].patid === data[j].patid && (data[i].aeterm === data[j].aeterm || oneRowPerPatient))
        isNew = false
      j++
    }
    if(isNew) {
      numberUnique++
    }
    data[i].index = numberUnique
  }
}


class PatientSummary extends Component {


  constructor(props) {
    super(props)
    this.state = {
      patid: this.props.data.patientData[0].patid,
      measureColumns: this.props.data.measureColumns === undefined? undefined: this.props.data.measureColumns[0],
      rightColumnInfo: 'legend'
    }
    this.updatePatient = this.updatePatient.bind(this)
    this.updateBloodValue = this.updateBloodValue.bind(this)
    this.changeRightColumn = this.changeRightColumn.bind(this)
  }

  componentDidMount() {
    $('.selectpicker').selectpicker()
  }

  componentDidUpdate() {
    $('.selectpicker').selectpicker()
  }

  // seelct patient
  // select blood value (over time value)

  updatePatient() {
    this.setState({patid: $('#patid').val()})
  }

  updateBloodValue() {
    const measureColumns = this.props.data.measureColumns.find(d => d.column === $('#measureColumns').val())
    this.setState({measureColumns: measureColumns})

  }

  changeRightColumn() {
    this.setState({rightColumnInfo: $('#rightColumn').val()})
  }


  render() {

    const {data, filteredData, totalHeight} = this.props
    const size = {width: 0.47*window.innerWidth, height: 350}
    const offset = {left: 50, right:50, top: 10, bottom: 50}

    var bloodSelect
    // if measure data was defined
    if(data.measureColumns !== undefined) {
      const bloodOptions = data.measureColumns.map((d,i) => <option key={i} value={d.column}>{d.label}</option>)
      bloodSelect = <Select id="measureColumns" className="add-patient" onChange={this.updateBloodValue}>
        {bloodOptions}
      </Select>
    }

    var toxPlot, bloodPlot, patient, treatmentPlot
    // if a patient has been selected
    if(this.state.patid !== undefined) {

      patient = data.patientData.find(p => p.patid === this.state.patid)
      var subData = filteredData.filter(d => d.patid === this.state.patid)
      getIndex(subData)
      var xMin = 0
      var xMax = max(subData.map(d => d.toxEnd))

      var subMeasureData = []
      if(data.measureData !== undefined){
        subMeasureData = data.measureData.filter(d => d.patid === this.state.patid)
        if(subData.length > 0) {
          xMin = Math.min(xMin, min(subMeasureData.map((d) => d.relativeTime)) + 1)
          xMax = Math.max(xMax, max(subMeasureData.map((d) => d.relativeTime)) + 1)
        }
      }

      const xScale = scaleLinear()
        .domain([xMin, xMax])
        .range([offset.left, size.width - offset.right])

       const yMin = min(subData.map((d) => d.index)) - 0.5
       const yMax = max(subData.map((d) => d.index)) + 0.5

       const height = 30 * (max(subData.map(d => d.index))+1) + offset.top + offset.bottom

       const yScale = scaleLinear()
          .domain([yMin, yMax])
          .range([offset.top, height-offset.bottom])

      const rowData = uniqBy(subData.map(d => {return {patid: d.patid, index: d.index, aeterm: d.aeterm}}), 'index')

      if(subMeasureData.filter(d => d[this.state.measureColumns.column] !== undefined).length > 0) {
        bloodPlot = <BloodPlot
          size={size}
          data={subMeasureData.filter(d => d[this.state.measureColumns.column] !== undefined).map((d,i) => {return {x: d.relativeTime, y: d[this.state.measureColumns.column]}})}
          xScale={xScale}
          measure={this.state.measureColumns}
          />
      } else if(data.measureData !== undefined){
        bloodPlot = <p>No measure data for this patient</p>
      } else {
        bloodPlot = <p>No measure data was loaded</p>
      }

      if(subData.length > 0) {
        toxPlot = <svg ref={node => this.node = node}
      width={size.width} height={height}>
          <AdverseEventRect
            filteredData={subData}
            xScale={xScale}
            yScale={yScale}
            colors={data.toxColors}/>
          <AdverseEventLabels data={rowData} xScale={xScale} yScale={yScale}/>
            <Axis
              side="bottom"
              lab="Time (days)"
              xScale={xScale}
              yPos={yScale.range()[1]}
            />
        </svg>
      } else {
        toxPlot = <p>No adverse event data selected</p>
      }

      // if treatment was specified in the data then add it.
      if(data.treatmentSpecification !== undefined) {
        treatmentPlot = <TreatmentPlotOnePatient
          size={size}
          data={data}
          patid={this.state.patid}
          xScale={xScale}/>
      }
    }


    var rightColumn

    if(this.state.rightColumnInfo === 'legend') {
      rightColumn = <div>
          <div>
            <ToxPlotKey key={0} width={300} data={data}/>
          </div>
          <div>
            <TreatmentPlotKey data={data}/>
          </div>
        </div>
    } else if(this.state.rightColumnInfo === 'ae') {
      rightColumn = patient !== undefined ? <ShowToxicityRecord
        data={data}
        totalHeight={totalHeight - 90}
        selectedPatient={patient}
        thisPatientsAeData={subData}
        /> : null
    } else if(this.state.rightColumnInfo === 'treatment') {
      rightColumn = patient !== undefined ? <ShowTreatmentSummary
        data={data}
        totalHeight={totalHeight - 90}
        selectedPatient={patient}
        /> : null
    }


    return [<div  key={0} className='item-middle'>
        <div className="row">
          <div style={{height:'10px'}}></div>
          <div className="col-xs-6">
            <PatientSelect patients={data.patientData} treatment={data.treatment} didChange={this.updatePatient}/>
          </div>
          <div className="col-xs-6">
            {bloodSelect}
          </div>
        <div className="col-xs-12">
          {bloodPlot}
          {treatmentPlot}
          {toxPlot}
        </div>
      </div>
    </div>,
    <div key={1} className='item-right'>
      <div style={{height:"30px"}}></div>
      <Select id='rightColumn' onChange={this.changeRightColumn}>
        <option value="legend">Legend</option>
        <option value="ae">Adverse event data</option>
        <option value="treatment">Treatment data</option>
      </Select>
      <div style={{height:"20px"}}></div>
      {rightColumn}
    </div>]
  }

}

export default PatientSummary
