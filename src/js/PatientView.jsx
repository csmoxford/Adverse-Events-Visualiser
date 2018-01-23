import React, {PureComponent } from 'react'
import { scaleLinear } from 'd3-scale'
import { min, max } from 'd3-array'
import Axis from './utils/Axis'
import {uniq, uniqBy} from 'lodash'

import 'bootstrap-select'
import "bootstrap-select/dist/css/bootstrap-select.css"
import './ToxFilters.css'

import BloodPlot from './BloodPlot'

import PatientSelect from './utils/PatientSelect'
import EventPolyline from './utils/EventPolyline'

import AdverseEventRect from './ToxPlot/AdverseEventRect'
import AdverseEventLabels from './ToxPlot/AdverseEventLabels'

import ShowToxicityRecord from './ShowPatient/ShowToxicityRecord'


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

class PatientView extends PureComponent {


  constructor(props) {
    super(props)
    this.state = {
      patid: this.props.data.patientData[0].patid,
      measureColumns: this.props.data.measureColumns == undefined? undefined: this.props.data.measureColumns[0]
    }
    this.updatePatient = this.updatePatient.bind(this)
    this.updateBloodValue = this.updateBloodValue.bind(this)
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
    const measureColumns = this.props.data.measureColumns.find(d => d.column == $('#measureColumns').val())
    this.setState({measureColumns: measureColumns})
  }


  render() {

    const {data, filteredData, filterValues, totalHeight} = this.props
    const size = {width: 0.47*window.innerWidth, height: 400}
    const offset = {left: 50, right:50, top: 10, bottom: 50}

    var bloodSelect
    if(data.measureColumns !== undefined) {
      const bloodOptions = data.measureColumns.map((d,i) => <option key={i} value={d.column}>{d.label}</option>)

      bloodSelect = <div className="add-patient">
        <label htmlFor="measureColumns">Measurement</label><br/>
        <select id="measureColumns" className="selectpicker" onChange={this.updateBloodValue}>
          {bloodOptions}
        </select>
      </div>
    }

    var toxPlot, bloodPlot, patient
    if(this.state.patid !== undefined) {


      var patient = data.patientData.find(p => p.patid === this.state.patid)
      var subData = filteredData.filter(d => d.patid === this.state.patid)
      getIndex(subData)

      var xMin = 0
      var xMax = max(subData.map((d) => d.toxEnd)) + 1


      var subMeasureData = []
      if(data.measureData != undefined){
        var subMeasureData = data.measureData.filter(d => d.patid == this.state.patid)
        if(subMeasureData.length > 0) {
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

      if(subMeasureData.filter(d => d[this.state.measureColumns.column] != undefined).length > 0) {
        bloodPlot = <BloodPlot
          size={size}
          data={subMeasureData.filter(d => d[this.state.measureColumns.column] != undefined).map((d,i) => {return {x: d.relativeTime, y: d[this.state.measureColumns.column]}})}
          xScale={xScale}
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
            yScale={yScale}/>
          <AdverseEventLabels data={rowData} xScale={xScale} yScale={yScale}/>
            <Axis
              side="bottom"
              lab="Time (days)"
              xScale={xScale}
              yPos={yScale.range()[1]}
            />
        </svg>
      } else {
        toxPlot = <p>No adverse events for this patient</p>
      }

    }

    return [<div  key={0} className='item-middle'>
        <div className="row">
          <div style={{height:'10px'}}></div>
          <div className="col-xs-3 col-xs-offset-3">
            <PatientSelect data={data.patientData} treatment={data.treatment} didChange={this.updatePatient}/>
          </div>
          <div className="col-xs-3">
            {bloodSelect}
          </div>
        <div className="col-xs-12">
          {bloodPlot}
          {toxPlot}
        </div>
      </div>
    </div>,
    <div key={1} className='item-right'>
      {patient !== undefined ? <ShowToxicityRecord
        data={data}
        totalHeight={totalHeight}
        selectedPatient={patient}
        thisData={subData}
        /> : null}
    </div>]
  }


}

export default PatientView
